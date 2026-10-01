export const wellnessMainCategories = [
  {
    id: 'fitness',
    name: 'Fitness',
    slug: 'fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'weight-management', name: 'Weight Management', slug: 'weight-management' },
      { id: 'sports-supplements', name: 'Sports Supplements', slug: 'sports-supplements' },
      { id: 'vitamins-supplements', name: 'Vitamin & Supplements', slug: 'vitamins-supplements' },
      { id: 'health-specific', name: 'Health Specific', slug: 'health-specific' },
      { id: 'nutrition-drinks', name: 'Nutrition Drinks', slug: 'nutrition-drinks' }
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'home-health', name: 'Home & Health', slug: 'home-health' },
      { id: 'senior-care', name: 'Senior Care', slug: 'senior-care' },
      { id: 'face-personal-care', name: 'Face Personal Care', slug: 'face-personal-care' },
      { id: 'hands-feet', name: 'Hands & Feet', slug: 'hands-feet' },
      { id: 'oral-care', name: 'Oral Care', slug: 'oral-care' },
      { id: 'bath-shower', name: 'Bath & Shower', slug: 'bath-shower' },
      { id: 'body-care', name: 'Body Care', slug: 'body-care' },
      { id: 'personal-care-tools', name: 'Personal Care Tools & Accessories', slug: 'personal-care-tools' }
    ]
  },
  {
    id: 'sexual-wellness',
    name: 'Sexual Wellness',
    slug: 'sexual-wellness',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'condoms', name: 'Condoms', slug: 'condoms' },
      { id: 'massagers-vibrators', name: 'Massagers / Vibrators', slug: 'massagers-vibrators' },
      { id: 'sexual-health-supplements', name: 'Sexual Health Supplements', slug: 'sexual-health-supplements' },
      { id: 'lubricants', name: 'Lubricants', slug: 'lubricants' },
      { id: 'intimate-tools-accessories', name: 'Intimate Tools & Accessories', slug: 'intimate-tools-accessories' }
    ]
  },
  {
    id: 'mom-baby',
    name: 'Mom & Baby',
    slug: 'mom-baby',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'baby-care', name: 'Baby Care', slug: 'baby-care' },
      { id: 'feminine-hygiene', name: 'Feminine Hygiene', slug: 'feminine-hygiene' },
      { id: 'maternity-care', name: 'Maternity Care', slug: 'maternity-care' },
      { id: 'baby-bath-time', name: 'Baby Bath Time', slug: 'baby-bath-time' }
    ]
  },
  {
    id: 'diabetes-support',
    name: 'Diabetes Support',
    slug: 'diabetes-support',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'sugar-substitutes', name: 'Sugar Substitutes', slug: 'sugar-substitutes' },
      { id: 'diabetes-management-supplements', name: 'Diabetes Management Supplements', slug: 'diabetes-management-supplements' },
      { id: 'diabetes-care-ayurveda', name: 'Diabetes Care Ayurveda', slug: 'diabetes-care-ayurveda' },
      { id: 'lancets-test-strips', name: 'Lancets & Test Strips', slug: 'lancets-test-strips' }
    ]
  },
  {
    id: 'devices',
    name: 'Devices',
    slug: 'devices',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'orthopaedics', name: 'Orthopaedics', slug: 'orthopaedics' },
      { id: 'measurements', name: 'Measurements', slug: 'measurements' },
      { id: 'surgical-accessories', name: 'Surgical Accessories', slug: 'surgical-accessories' }
    ]
  },
  {
    id: 'surgical',
    name: 'Surgical',
    slug: 'surgical',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80',
    subcategories: [
      { id: 'respiratory-supplies', name: 'Respiratory Supplies', slug: 'respiratory-supplies' },
      { id: 'surgical-consumables', name: 'Surgical Consumables', slug: 'surgical-consumables' },
      { id: 'iv-infusion', name: 'IV Infusion', slug: 'iv-infusion' },
      { id: 'surgical-instrument', name: 'Surgical Instrument', slug: 'surgical-instrument' },
      { id: 'dressing', name: 'Dressing', slug: 'dressing' },
      { id: 'gi-care', name: 'GI Care', slug: 'gi-care' },
      { id: 'urinary-care', name: 'Urinary Care', slug: 'urinary-care' },
      { id: 'wound-treatment', name: 'Wound Treatment', slug: 'wound-treatment' }
    ]
  }
]

export const wellnessSubCategories = wellnessMainCategories.flatMap((category) =>
  category.subcategories.map((subcategory) => ({
    ...subcategory,
    parentCategoryId: category.id,
    parentCategoryName: category.name
  }))
)

export const wellnessHeroSlides = [
  {
    title: 'Daily wellness, made simple',
    subtitle: 'Discover immunity boosters, supplements, nutrition drinks, and self-care essentials.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Fuel your fitness',
    subtitle: 'Support your goals with proteins, multivitamins, and recovery essentials.',
    image: 'https://images.unsplash.com/photo-1517949092341-0f6f1f3f7cf4?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Wellness for every stage',
    subtitle: 'Find care products for diabetes support, mom & baby, and everyday health.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80'
  }
]

export const wellnessHighlights = [
  { id: 'health-essentials', name: 'Health Essentials', route: '/wellness/health-specific', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80' },
  { id: 'nutrition-drinks', name: 'Nutrition Drinks', route: '/wellness/nutrition-drinks', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80' },
  { id: 'vitamins-supplements', name: 'Vitamins & Supplements', route: '/wellness/vitamins-supplements', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80' },
  { id: 'sports-nutrition', name: 'Sports Nutrition', route: '/wellness/sports-supplements', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80' }
]

export const wellnessProducts = [
  { id: 101, name: 'Himalaya Ashvagandha', brand: 'Himalaya', price: 499, originalPrice: 649, discount: 23, rating: 4.7, stock: 'In Stock', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80' },
  { id: 102, name: 'Ensure Nutrition Drink', brand: 'Ensure', price: 799, originalPrice: 999, discount: 20, rating: 4.8, stock: 'In Stock', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80' },
  { id: 103, name: 'MuscleBlaze Whey Protein', brand: 'MuscleBlaze', price: 2499, originalPrice: 2999, discount: 17, rating: 4.9, stock: 'In Stock', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80' },
  { id: 104, name: 'Baidyanath Vitamineral', brand: 'Baidyanath', price: 329, originalPrice: 399, discount: 18, rating: 4.6, stock: 'Low Stock', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80' }
]

export const wellnessBrands = ['Himalaya', 'Ensure', 'MuscleBlaze', 'Baidyanath', 'Zandu', 'Dabur', 'Natures Velvet', 'Nivea']

export const wellnessBestSellers = [
  { id: 201, name: 'Baidyanath Chyawanprash', rating: 4.8, price: 320, discount: 15, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80' },
  { id: 202, name: 'Optimum Nutrition BCAA', rating: 4.7, price: 1899, discount: 10, image: 'https://images.unsplash.com/photo-1517949092341-0f6f1f3f7cf4?auto=format&fit=crop&w=500&q=80' },
  { id: 203, name: 'Dabur Honey', rating: 4.6, price: 299, discount: 12, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80' }
]

export const wellnessNewArrivals = [
  { id: 301, name: 'Vitamin D3 Gummies', price: 549, rating: 4.5, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80' },
  { id: 302, name: 'Protein Bars', price: 399, rating: 4.4, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80' },
  { id: 303, name: 'Cold Relief Roll On', price: 199, rating: 4.3, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80' }
]
