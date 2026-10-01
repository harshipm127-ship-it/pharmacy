const CART_STORAGE_KEY = 'medical_ecommerce_cart'
const SAVED_FOR_LATER_STORAGE_KEY = 'medical_ecommerce_saved_for_later'

function parsePrice(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[^0-9.-]/g, '')
    const parsedValue = Number(cleanedValue)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

function normalizeProduct(product) {
  const price = parsePrice(product.price)
  const originalPrice = parsePrice(product.originalPrice || product.mrp || product.price)
  const discount = Number(product.discount || 0)

  return {
    id: product.id || product.product_id || product.productId || Date.now(),
    name: product.name,
    brand: product.brand?.name || product.brand || product.manufacturer || 'Trusted Brand',
    category: product.category || 'General',
    description: product.description || 'Trusted daily care essentials curated for your routine.',
    price,
    originalPrice: originalPrice || price,
    discount,
    stock: Number(product.stock || 55),
    image: product.image || product.image_url || product.images?.[0]?.url || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    quantity: Number(product.quantity || 1),
    deliveryDate: product.deliveryDate || 'Tomorrow'
  }
}

function notifyCartUpdated(items) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }))
  }
}

const cartService = {
  getCart() {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  },

  saveCart(items) {
    if (typeof window === 'undefined') {
      return items
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    notifyCartUpdated(items)
    return items
  },

  getSavedForLater() {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      return JSON.parse(localStorage.getItem(SAVED_FOR_LATER_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  },

  saveSavedForLater(items) {
    if (typeof window === 'undefined') {
      return items
    }

    localStorage.setItem(SAVED_FOR_LATER_STORAGE_KEY, JSON.stringify(items))
    return items
  },

  addToCart(product) {
    const existingCart = this.getCart()
    const normalizedProduct = normalizeProduct(product)
    const existingItem = existingCart.find((item) => item.id === normalizedProduct.id)

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + normalizedProduct.quantity, normalizedProduct.stock || existingItem.quantity + normalizedProduct.quantity)
    } else {
      existingCart.push(normalizedProduct)
    }

    return this.saveCart(existingCart)
  },

  updateQuantity(productId, quantity) {
    const existingCart = this.getCart()
    const nextItems = existingCart.map((item) => {
      if (item.id !== productId) {
        return item
      }

      return {
        ...item,
        quantity: Math.max(1, Math.min(quantity, item.stock || quantity))
      }
    })

    return this.saveCart(nextItems)
  },

  removeFromCart(productId) {
    const nextItems = this.getCart().filter((item) => item.id !== productId)
    return this.saveCart(nextItems)
  },

  saveForLater(productId) {
    const cartItems = this.getCart()
    const savedItems = this.getSavedForLater()
    const productToSave = cartItems.find((item) => item.id === productId)

    if (!productToSave) {
      return { cart: cartItems, saved: savedItems }
    }

    const nextCart = cartItems.filter((item) => item.id !== productId)
    const nextSaved = [...savedItems, productToSave]

    this.saveCart(nextCart)
    this.saveSavedForLater(nextSaved)

    return { cart: nextCart, saved: nextSaved }
  },

  moveToCart(productId) {
    const savedItems = this.getSavedForLater()
    const cartItems = this.getCart()
    const productToMove = savedItems.find((item) => item.id === productId)

    if (!productToMove) {
      return { cart: cartItems, saved: savedItems }
    }

    const nextSaved = savedItems.filter((item) => item.id !== productId)
    const nextCart = [...cartItems, productToMove]

    this.saveCart(nextCart)
    this.saveSavedForLater(nextSaved)

    return { cart: nextCart, saved: nextSaved }
  },

  clearCart() {
    if (typeof window === 'undefined') {
      return []
    }

    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(SAVED_FOR_LATER_STORAGE_KEY)
    notifyCartUpdated([])
    return []
  },

  getCartCount() {
    return this.getCart().reduce((total, item) => total + Number(item.quantity || 0), 0)
  }
}

export default cartService
