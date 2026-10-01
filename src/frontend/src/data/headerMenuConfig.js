export const headerNavItems = [
  { key: 'categories', label: 'All Categories', to: '/categories', icon: '☰', menuKey: 'categories' },
  { key: 'medicine', label: 'Medicine', to: '/medicine', icon: '💊', menuKey: 'medicine' },
  { key: 'beauty', label: 'Beauty', to: '/beauty', icon: '✨', menuKey: 'beauty' },
  { key: 'wellness', label: 'Wellness', to: '/wellness', icon: '🌿', menuKey: 'wellness' },
  { key: 'offers', label: 'Offers', to: '/offers', icon: '🎁', menuKey: 'offers' }
]

export const headerMenuData = {
  categories: {
    title: 'Category shortcuts',
    dropdownItems: [
      { label: 'All Categories', route: '/categories' },
      { label: 'Top Deals', route: '/offers' },
      { label: 'New Arrivals', route: '/categories?filter=new' },
      { label: 'Wellness Essentials', route: '/wellness' }
    ]
  },
  medicine: {
    title: 'Medicine quick links',
    dropdownItems: [
      { label: 'All Medicines', route: '/medicine' },
      { label: 'Medicines by Health Issues', route: '/medicines/health-issues' },
      { label: 'Medicines for Body Parts', route: '/medicines/body-parts' }
    ]
  },
  beauty: {
    title: 'Beauty essentials',
    children: [
      {
        id: 'fragrances',
        name: 'Fragrances',
        route: '/beauty/fragrances',
        children: [
          { id: 'mens-fragrances', name: "Men's Fragrances", route: '/beauty/fragrances/mens-fragrances' },
          { id: 'womens-fragrances', name: "Women's Fragrances", route: '/beauty/fragrances/womens-fragrances' },
          { id: 'unisex-fragrances', name: 'Unisex Fragrances', route: '/beauty/fragrances/unisex-fragrances' }
        ]
      },
      {
        id: 'hair-care',
        name: 'Hair Care',
        route: '/beauty/hair-care',
        children: [
          { id: 'shampoo', name: 'Shampoo', route: '/beauty/hair-care/shampoo' },
          { id: 'conditioner', name: 'Conditioner', route: '/beauty/hair-care/conditioner' },
          { id: 'hair-oil', name: 'Hair Oil', route: '/beauty/hair-care/hair-oil' },
          { id: 'hair-serum', name: 'Hair Serum', route: '/beauty/hair-care/hair-serum' },
          { id: 'hair-color', name: 'Hair Color', route: '/beauty/hair-care/hair-color' },
          { id: 'hair-mask', name: 'Hair Mask', route: '/beauty/hair-care/hair-mask' },
          { id: 'hair-styling', name: 'Hair Styling', route: '/beauty/hair-care/hair-styling' }
        ]
      },
      {
        id: 'mens-grooming',
        name: "Men's Grooming",
        route: '/beauty/mens-grooming',
        children: [
          { id: 'beard-oil', name: 'Beard Oil', route: '/beauty/mens-grooming/beard-oil' },
          { id: 'beard-wash', name: 'Beard Wash', route: '/beauty/mens-grooming/beard-wash' },
          { id: 'beard-trimmer', name: 'Beard Trimmer', route: '/beauty/mens-grooming/beard-trimmer' },
          { id: 'shaving-cream', name: 'Shaving Cream', route: '/beauty/mens-grooming/shaving-cream' },
          { id: 'razor', name: 'Razor', route: '/beauty/mens-grooming/razor' },
          { id: 'after-shave', name: 'After Shave', route: '/beauty/mens-grooming/after-shave' },
          { id: 'face-wash-men', name: 'Face Wash for Men', route: '/beauty/mens-grooming/face-wash-for-men' }
        ]
      },
      {
        id: 'make-up',
        name: 'Make-Up',
        route: '/beauty/make-up',
        children: [
          { id: 'lipstick', name: 'Lipstick', route: '/beauty/make-up/lipstick' },
          { id: 'foundation', name: 'Foundation', route: '/beauty/make-up/foundation' },
          { id: 'compact-powder', name: 'Compact Powder', route: '/beauty/make-up/compact-powder' },
          { id: 'concealer', name: 'Concealer', route: '/beauty/make-up/concealer' },
          { id: 'kajal', name: 'Kajal', route: '/beauty/make-up/kajal' },
          { id: 'eyeliner', name: 'Eyeliner', route: '/beauty/make-up/eyeliner' },
          { id: 'mascara', name: 'Mascara', route: '/beauty/make-up/mascara' },
          { id: 'nail-polish', name: 'Nail Polish', route: '/beauty/make-up/nail-polish' }
        ]
      },
      {
        id: 'mom-baby',
        name: 'Mom & Baby',
        route: '/beauty/mom-baby',
        children: [
          { id: 'baby-food', name: 'Baby Food', route: '/beauty/mom-baby/baby-food' },
          { id: 'baby-diapers', name: 'Baby Diapers', route: '/beauty/mom-baby/baby-diapers' },
          { id: 'baby-wipes', name: 'Baby Wipes', route: '/beauty/mom-baby/baby-wipes' },
          { id: 'baby-lotion', name: 'Baby Lotion', route: '/beauty/mom-baby/baby-lotion' },
          { id: 'baby-shampoo', name: 'Baby Shampoo', route: '/beauty/mom-baby/baby-shampoo' },
          { id: 'baby-soap', name: 'Baby Soap', route: '/beauty/mom-baby/baby-soap' },
          { id: 'baby-powder', name: 'Baby Powder', route: '/beauty/mom-baby/baby-powder' }
        ]
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        route: '/beauty/personal-care',
        children: [
          { id: 'body-wash', name: 'Body Wash', route: '/beauty/personal-care/body-wash' },
          { id: 'soap', name: 'Soap', route: '/beauty/personal-care/soap' },
          { id: 'hand-wash', name: 'Hand Wash', route: '/beauty/personal-care/hand-wash' },
          { id: 'deodorants', name: 'Deodorants', route: '/beauty/personal-care/deodorants' },
          { id: 'perfumes', name: 'Perfumes', route: '/beauty/personal-care/perfumes' },
          { id: 'sanitary-pads', name: 'Sanitary Pads', route: '/beauty/personal-care/sanitary-pads' },
          { id: 'oral-care', name: 'Oral Care', route: '/beauty/personal-care/oral-care' }
        ]
      },
      {
        id: 'skin-care',
        name: 'Skin Care',
        route: '/beauty/skin-care',
        children: [
          { id: 'face-wash', name: 'Face Wash', route: '/beauty/skin-care/face-wash' },
          { id: 'moisturizer', name: 'Moisturizer', route: '/beauty/skin-care/moisturizer' },
          { id: 'sunscreen', name: 'Sunscreen', route: '/beauty/skin-care/sunscreen' },
          { id: 'face-serum', name: 'Face Serum', route: '/beauty/skin-care/face-serum' },
          { id: 'night-cream', name: 'Night Cream', route: '/beauty/skin-care/night-cream' },
          { id: 'face-mask', name: 'Face Mask', route: '/beauty/skin-care/face-mask' },
          { id: 'toner', name: 'Toner', route: '/beauty/skin-care/toner' }
        ]
      },
      {
        id: 'tools-appliances',
        name: 'Tools & Appliances',
        route: '/beauty/tools-appliances',
        children: [
          { id: 'hair-dryer', name: 'Hair Dryer', route: '/beauty/tools-appliances/hair-dryer' },
          { id: 'hair-straightener', name: 'Hair Straightener', route: '/beauty/tools-appliances/hair-straightener' },
          { id: 'hair-curler', name: 'Hair Curler', route: '/beauty/tools-appliances/hair-curler' },
          { id: 'trimmer', name: 'Trimmer', route: '/beauty/tools-appliances/trimmer' },
          { id: 'electric-toothbrush', name: 'Electric Toothbrush', route: '/beauty/tools-appliances/electric-toothbrush' },
          { id: 'face-massager', name: 'Face Massager', route: '/beauty/tools-appliances/face-massager' }
        ]
      }
    ]
  },
  wellness: {
    title: 'Wellness categories',
    children: [
      {
        id: 'weight-management',
        name: 'Weight Management',
        route: '/wellness/weight-management',
        children: [
          { id: 'ayush', name: 'Ayush', route: '/wellness/ayush' },
          { id: 'fitness', name: 'Fitness', route: '/wellness/fitness' },
          { id: 'personal-care', name: 'Personal Care', route: '/wellness/personal-care' },
          { id: 'sexual-wellness', name: 'Sexual Wellness', route: '/wellness/sexual-wellness' },
          { id: 'mom-baby', name: 'Mom & Baby', route: '/wellness/mom-baby' },
          { id: 'diabetes-support', name: 'Diabetes Support', route: '/wellness/diabetes-support' },
          { id: 'devices', name: 'Devices', route: '/wellness/devices' },
          { id: 'surgical', name: 'Surgical', route: '/wellness/surgical' }
        ]
      },
      {
        id: 'sports-supplements',
        name: 'Sports Supplements',
        route: '/wellness/sports-supplements',
        children: [
          { id: 'ayush', name: 'Ayush', route: '/wellness/ayush' },
          { id: 'fitness', name: 'Fitness', route: '/wellness/fitness' },
          { id: 'personal-care', name: 'Personal Care', route: '/wellness/personal-care' },
          { id: 'sexual-wellness', name: 'Sexual Wellness', route: '/wellness/sexual-wellness' },
          { id: 'mom-baby', name: 'Mom & Baby', route: '/wellness/mom-baby' },
          { id: 'diabetes-support', name: 'Diabetes Support', route: '/wellness/diabetes-support' },
          { id: 'devices', name: 'Devices', route: '/wellness/devices' },
          { id: 'surgical', name: 'Surgical', route: '/wellness/surgical' }
        ]
      },
      {
        id: 'vitamins-supplements',
        name: 'Vitamin & Supplements',
        route: '/wellness/vitamins-supplements',
        children: [
          { id: 'ayush', name: 'Ayush', route: '/wellness/ayush' },
          { id: 'fitness', name: 'Fitness', route: '/wellness/fitness' },
          { id: 'personal-care', name: 'Personal Care', route: '/wellness/personal-care' },
          { id: 'sexual-wellness', name: 'Sexual Wellness', route: '/wellness/sexual-wellness' },
          { id: 'mom-baby', name: 'Mom & Baby', route: '/wellness/mom-baby' },
          { id: 'diabetes-support', name: 'Diabetes Support', route: '/wellness/diabetes-support' },
          { id: 'devices', name: 'Devices', route: '/wellness/devices' },
          { id: 'surgical', name: 'Surgical', route: '/wellness/surgical' }
        ]
      },
      {
        id: 'health-specific',
        name: 'Health Specific',
        route: '/wellness/health-specific',
        children: [
          { id: 'ayush', name: 'Ayush', route: '/wellness/ayush' },
          { id: 'fitness', name: 'Fitness', route: '/wellness/fitness' },
          { id: 'personal-care', name: 'Personal Care', route: '/wellness/personal-care' },
          { id: 'sexual-wellness', name: 'Sexual Wellness', route: '/wellness/sexual-wellness' },
          { id: 'mom-baby', name: 'Mom & Baby', route: '/wellness/mom-baby' },
          { id: 'diabetes-support', name: 'Diabetes Support', route: '/wellness/diabetes-support' },
          { id: 'devices', name: 'Devices', route: '/wellness/devices' },
          { id: 'surgical', name: 'Surgical', route: '/wellness/surgical' }
        ]
      },
      {
        id: 'nutrition-drinks',
        name: 'Nutrition Drinks',
        route: '/wellness/nutrition-drinks',
        children: [
          { id: 'ayush', name: 'Ayush', route: '/wellness/ayush' },
          { id: 'fitness', name: 'Fitness', route: '/wellness/fitness' },
          { id: 'personal-care', name: 'Personal Care', route: '/wellness/personal-care' },
          { id: 'sexual-wellness', name: 'Sexual Wellness', route: '/wellness/sexual-wellness' },
          { id: 'mom-baby', name: 'Mom & Baby', route: '/wellness/mom-baby' },
          { id: 'diabetes-support', name: 'Diabetes Support', route: '/wellness/diabetes-support' },
          { id: 'devices', name: 'Devices', route: '/wellness/devices' },
          { id: 'surgical', name: 'Surgical', route: '/wellness/surgical' }
        ]
      }
    ]
  },
  offers: {
    title: 'Offer zones',
    dropdownItems: [
      { label: 'Coupons', route: '/offers/coupons' },
      { label: 'Discounted Products', route: '/offers/discounted-products' },
      { label: 'Combo Offers', route: '/offers/combo-offers' },
      { label: 'Bank Offers', route: '/offers/bank-offers' },
      { label: 'Seasonal Offers', route: '/offers/seasonal-offers' }
    ]
  }
}
