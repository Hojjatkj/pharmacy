import { Pharmacy, ProductItem, PharmacyStockItem, B2BExchangeMatch } from '../types';

export const mockPharmacies: Pharmacy[] = [
  {
    id: 'ph-1',
    name: 'داروخانه شبانه‌روزی دکتر راد',
    licenseNumber: 'DR-1402-9981',
    technicalManager: 'دکتر محمدرضا راد (داروساز)',
    city: 'تهران',
    province: 'تهران',
    address: 'تهران، خیابان شریعتی، بالاتر از پل رومی، پلاک ۴۱۰',
    phone: '۰۲۱-۲۲۶۵۴۳۲۱',
    trustScore: 98,
    activeB2BExchange: true,
    avatar: '🏥',
  },
  {
    id: 'ph-2',
    name: 'داروخانه مرکزی رازی',
    licenseNumber: 'DR-1399-4412',
    technicalManager: 'دکتر مریم شمس',
    city: 'تهران',
    province: 'تهران',
    address: 'تهران، میدان ونک، ابتدای ملاصدرا، جنب بانک سامان',
    phone: '۰۲۱-۸۸۷۶۵۴۳۲',
    trustScore: 95,
    activeB2BExchange: true,
    avatar: '💊',
  },
  {
    id: 'ph-3',
    name: 'داروخانه تخصصی فارابی',
    licenseNumber: 'DR-1401-7734',
    technicalManager: 'دکتر علیرضا رستگار',
    city: 'اصفهان',
    province: 'اصفهان',
    address: 'اصفهان، خیابان چهارباغ بالا، مجتمع پزشکان پارس',
    phone: '۰۳۱-۳۶۲۸۹۰۰۱',
    trustScore: 92,
    activeB2BExchange: true,
    avatar: '🩺',
  },
  {
    id: 'ph-4',
    name: 'داروخانه دکتر افشار',
    licenseNumber: 'DR-1398-1129',
    technicalManager: 'دکتر بهاره افشار',
    city: 'شیراز',
    province: 'فارس',
    address: 'شیراز، خیابان زند، حدفاصل بیست‌متری و صورتگر',
    phone: '۰۷۱-۳۲۳۴۵۶۷۸',
    trustScore: 94,
    activeB2BExchange: true,
    avatar: '🌿',
  },
  {
    id: 'ph-5',
    name: 'داروخانه مهرگان',
    licenseNumber: 'DR-1400-5590',
    technicalManager: 'دکتر کیانوش هدایتی',
    city: 'مشهد',
    province: 'خراسان رضوی',
    address: 'مشهد، بلوار سجاد، چهارراه بهار، پلاک ۸۵',
    phone: '۰۵۱-۳۷۶۵۴۳۲۱',
    trustScore: 90,
    activeB2BExchange: true,
    avatar: '✨',
  }
];

export const mockCatalogProducts: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'کپسول زینک پلاس ۱۰ میلی‌گرم یوروویتال (۶۰ عددی)',
    genericName: 'Zinc Plus 10mg Eurho Vital 60 Caps',
    category: 'supplement',
    brand: 'یوروویتال (آلمان/ایران)',
    ircCode: '1228143290012456',
    gtin: '06260123456789',
    unit: 'جعبه',
    basePrice: 320000, // Tomans
  },
  {
    id: 'prod-2',
    name: 'سافت‌ژل امگا ۳ بدون جیوه هلث‌برست (۱۰۰ عددی)',
    genericName: 'Omega-3 Mercury-Free Health Burst',
    category: 'supplement',
    brand: 'هلث‌برست (آمریکا/ایران)',
    ircCode: '1228091873612389',
    gtin: '06260987654321',
    unit: 'قوطی',
    basePrice: 480000,
  },
  {
    id: 'prod-3',
    name: 'پودر کلاژن بیوتی گلد کلاژن کلاژینو (۳۰ ساشه)',
    genericName: 'Collagino Gold Collagen Peptides 30 Sachets',
    category: 'cosmetic',
    brand: 'کلاژینو (فرانسه)',
    ircCode: '1228773419082341',
    gtin: '06260112233445',
    unit: 'جعبه',
    basePrice: 690000,
  },
  {
    id: 'prod-4',
    name: 'کپسول هیرتامین ادونسد فرمولا (۳۰ عددی)',
    genericName: 'Hairtamin Advanced Formula 30 Veggie Caps',
    category: 'supplement',
    brand: 'هیرتامین',
    ircCode: '1228554433221100',
    gtin: '06260554433221',
    unit: 'قوطی',
    basePrice: 920000,
  },
  {
    id: 'prod-5',
    name: 'پودر پروتئین وی ۱۰۰٪ ایزوله کارن (۲۲۷۰ گرمی)',
    genericName: 'Karen Pure Whey Protein Isolate 2270g',
    category: 'sports_nutrition',
    brand: 'کارن (Karen)',
    ircCode: '1228339900112233',
    gtin: '06260339900112',
    unit: 'سطل',
    basePrice: 3450000,
  },
  {
    id: 'prod-6',
    name: 'قرص جوشان ویتامین C ۱۰۰۰ میلی‌گرم آپویتال (۲۰ عددی)',
    genericName: 'Apovital Vitamin C 1000mg 20 Effervescent',
    category: 'otc_health',
    brand: 'آپویتال (Apovital)',
    ircCode: '1228445566778899',
    gtin: '06260445566778',
    unit: 'تیوب',
    basePrice: 110000,
  },
  {
    id: 'prod-7',
    name: 'کرم ضد آفتاب فلوئیدی فیوژن واتر پریم SPF50',
    genericName: 'Prime Fusion Water Tinted Sunscreen SPF50',
    category: 'cosmetic',
    brand: 'پریم (Prime)',
    ircCode: '1228998877665544',
    gtin: '06260998877665',
    unit: 'تیوب',
    basePrice: 385000,
  },
  {
    id: 'prod-8',
    name: 'سافت‌ژل ویتامین D3 ۵۰۰۰۰ واحد دانا (۱۰۰ عددی)',
    genericName: 'Vitamin D3 50000 IU Daana 100 Softgels',
    category: 'otc_health',
    brand: 'داروسازی دانا',
    ircCode: '1228112233445566',
    gtin: '06260112233445',
    unit: 'جعبه',
    basePrice: 145000,
  }
];

export const initialStockItems: PharmacyStockItem[] = [
  {
    id: 'st-1',
    pharmacyId: 'ph-1', // دکتر راد
    productId: 'prod-3', // کلاژن
    product: mockCatalogProducts[2],
    batchNumber: 'BN-2024-88',
    expiryDate: '2026-11-20',
    daysToExpiry: 64, // 64 days left! CRITICAL!
    currentStock: 120, // 120 boxes in warehouse
    reservedStock: 5,
    dailySalesVelocity: 0.6, // only 0.6 box/day in Dr. Rad's location!
    daysOfInventoryLeft: 200, // Will take 200 days to sell normally -> RISK OF EXPIRATION
    riskLevel: 'critical',
    originalCost: 550000,
    sellingPrice: 690000,
    minAcceptablePriceB2B: 570000,
  },
  {
    id: 'st-2',
    pharmacyId: 'ph-1',
    productId: 'prod-2', // امگا ۳
    product: mockCatalogProducts[1],
    batchNumber: 'BN-2025-102',
    expiryDate: '2027-04-15',
    daysToExpiry: 210,
    currentStock: 45,
    reservedStock: 2,
    dailySalesVelocity: 1.8,
    daysOfInventoryLeft: 25,
    riskLevel: 'optimal',
    originalCost: 390000,
    sellingPrice: 480000,
    minAcceptablePriceB2B: 410000,
  },
  {
    id: 'st-3',
    pharmacyId: 'ph-1',
    productId: 'prod-5', // پروتئین وی کارن
    product: mockCatalogProducts[4],
    batchNumber: 'BN-2024-910',
    expiryDate: '2026-12-30',
    daysToExpiry: 104,
    currentStock: 28,
    reservedStock: 0,
    dailySalesVelocity: 0.2, // low sales in clinic zone
    daysOfInventoryLeft: 140, // 140 days to sell, only 104 days left!
    riskLevel: 'warning',
    originalCost: 2850000,
    sellingPrice: 3450000,
    minAcceptablePriceB2B: 2950000,
  },
  {
    id: 'st-4',
    pharmacyId: 'ph-1',
    productId: 'prod-1', // زینک پلاس
    product: mockCatalogProducts[0],
    batchNumber: 'BN-2025-44',
    expiryDate: '2027-08-10',
    daysToExpiry: 325,
    currentStock: 8,
    reservedStock: 1,
    dailySalesVelocity: 4.2, // very high demand
    daysOfInventoryLeft: 1.9, // running out!
    riskLevel: 'low_stock',
    originalCost: 250000,
    sellingPrice: 320000,
    minAcceptablePriceB2B: 270000,
  },
  {
    id: 'st-5',
    pharmacyId: 'ph-1',
    productId: 'prod-6', // ویتامین ث
    product: mockCatalogProducts[5],
    batchNumber: 'BN-2025-78',
    expiryDate: '2027-06-01',
    daysToExpiry: 257,
    currentStock: 90,
    reservedStock: 4,
    dailySalesVelocity: 3.5,
    daysOfInventoryLeft: 25.7,
    riskLevel: 'optimal',
    originalCost: 85000,
    sellingPrice: 110000,
    minAcceptablePriceB2B: 92000,
  },
  {
    id: 'st-6',
    pharmacyId: 'ph-1',
    productId: 'prod-7', // ضد آفتاب پریم
    product: mockCatalogProducts[6],
    batchNumber: 'BN-2025-02',
    expiryDate: '2027-03-20',
    daysToExpiry: 184,
    currentStock: 60,
    reservedStock: 3,
    dailySalesVelocity: 1.2,
    daysOfInventoryLeft: 50,
    riskLevel: 'optimal',
    originalCost: 310000,
    sellingPrice: 385000,
    minAcceptablePriceB2B: 330000,
  }
];

export const initialAiMatches: B2BExchangeMatch[] = [
  {
    id: 'match-1',
    sourcePharmacy: mockPharmacies[0], // داروخانه دکتر راد (تهران - شریعتی)
    targetPharmacy: mockPharmacies[1], // داروخانه رازی (تهران - ونک)
    product: mockCatalogProducts[2], // پودر کلاژن کلاژینو
    batchNumber: 'BN-2024-88',
    expiryDate: '2026-11-20',
    availableQuantity: 120,
    recommendedTransferQty: 85,
    originalPrice: 690000,
    aiSuggestedPrice: 585000,
    discountPercentage: 15.2,
    estimatedLossAvoided: 49725000, // 49.7 Million Tomans protected from expiration!
    targetDemandVelocity: 4.8, // Pharmacy Razi sells 4.8 boxes/day!
    reasoning: 'داروخانه رازی در ونک دارای تقاضای بالای مکمل‌های کلاژن بیوتی (۴.۸ بسته در روز) بوده و موجودی آن رو به اتمام است. انتقال ۸۵ بسته با تخفیف ۱۵.۲٪ مانع از سوختن سرمایه داروخانه راد در ۶۴ روز آینده خواهد شد و داروخانه رازی سود حاشیه مناسبی کسب می‌کند.',
    matchScore: 96,
    status: 'pending'
  },
  {
    id: 'match-2',
    sourcePharmacy: mockPharmacies[0], // دکتر راد
    targetPharmacy: mockPharmacies[4], // داروخانه مهرگان مشهد (نزدیک باشگاه‌های ورزشی سجاد)
    product: mockCatalogProducts[4], // پروتئین وی کارن
    batchNumber: 'BN-2024-910',
    expiryDate: '2026-12-30',
    availableQuantity: 28,
    recommendedTransferQty: 20,
    originalPrice: 3450000,
    aiSuggestedPrice: 3050000,
    discountPercentage: 11.6,
    estimatedLossAvoided: 61000000, // 61 Million Tomans protected!
    targetDemandVelocity: 1.5,
    reasoning: 'آهنگ فروش پروتئین وی کارن در منطقه داروخانه مهرگان مشهد (بلوار سجاد) ۸ برابر داروخانه دکتر راد است. ۲۰ قوطی پیش از انقضای ۱۰۴ روزه جذب بازار هدف ورزشی خواهد شد.',
    matchScore: 91,
    status: 'pending'
  },
  {
    id: 'match-3',
    sourcePharmacy: mockPharmacies[2], // فارابی اصفهان
    targetPharmacy: mockPharmacies[0], // دکتر راد (خرید کسری)
    product: mockCatalogProducts[0], // زینک پلاس
    batchNumber: 'BN-2025-119',
    expiryDate: '2027-09-15',
    availableQuantity: 200,
    recommendedTransferQty: 60,
    originalPrice: 320000,
    aiSuggestedPrice: 275000,
    discountPercentage: 14.0,
    estimatedLossAvoided: 16500000,
    targetDemandVelocity: 4.2,
    reasoning: 'داروخانه دکتر راد در محصول زینک پلاس کسری موجودی فوری (موجودی کمتر از ۲ روز) دارد، در حالی که داروخانه فارابی مازاد خرید شرکتی داشته و آماده عرضه فوری است.',
    matchScore: 94,
    status: 'pending'
  }
];
