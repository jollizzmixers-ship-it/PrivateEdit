import { Product, Coupon, Order, Customer } from '../types';

export const LUXURY_PRODUCTS: Product[] = [
  {
    id: "pe-001",
    name: "The Amandine Box Bag",
    category: "handbags",
    priceINR: 18900,
    discountPriceINR: 14999,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    description: "An architectural masterpiece designed for the refined modern woman. Handcrafted from premium fine-grain Italian calf leather with 24k gold-electroplated brass hardware, this structured bag transitions effortlessly from day elegance to twilight soirées.",
    details: [
      "100% Full-grain European calf leather",
      "Signature hand-polished enamel monogram lock closure",
      "Custom velvet-lined double compartment interior with zip pocket",
      "Adjustable, detachable structured shoulder strap (55cm drop)",
      "Protective baseline gold-tone feet arches",
      "Delivered in a signature presentation box with organic linen dustbag"
    ],
    specifications: {
      "Dimensions": "21 cm Width x 15 cm Height x 8 cm Depth",
      "Weight": "540g",
      "Material Origin": "Tuscany, Italy",
      "Hardware": "Brushed 24k Gold Electroplated Brass",
      "Taxes": "Included",
      "Shipping": "Complimentary worldwide priority delivery"
    },
    rating: 4.9,
    stock: 12,
    colors: ["Alabaster Ivory", "Midnight Noir", "Sable Taupe"],
    featured: true,
    bestSeller: true
  },
  {
    id: "pe-002",
    name: "The Celine Trapeze Satchel",
    category: "handbags",
    priceINR: 24900,
    discountPriceINR: 19500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a0?auto=format&fit=crop&w=800&q=80",
    description: "A spacious yet exquisitely balanced satchel, boasting winged side panels in a fine grained calf skin. Celebrated for its unique sleek silhouette, it offers spacious, highly organized luxury fitted with brushed nickel hardware.",
    details: [
      "French micro-pebbled premium calfskin",
      "Hand-painted and creased lacquered edges",
      "Generous expandable side gussets",
      "Rear secure-zip external passport pocket",
      "Sleek silver-tone push-lock flap mechanism",
      "Spacious main compartment with signature key loop"
    ],
    specifications: {
      "Dimensions": "28 cm Width x 20 cm Height x 12 cm Depth",
      "Weight": "680g",
      "Material Origin": "Lyon, France",
      "Hardware": "Brushed Structural Nickel",
      "Taxes": "Included",
      "Shipping": "Complimentary worldwide priority delivery"
    },
    rating: 4.8,
    stock: 8,
    colors: ["Duna Cream", "Verde Olive", "Camel Tan"],
    featured: false,
    bestSeller: true
  },
  {
    id: "pe-005",
    name: "The Eternelle Classic Link Watch",
    category: "watches",
    priceINR: 22500,
    discountPriceINR: 18500,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
    description: "Capturing the essence of timeless Swiss horology. Featuring a genuine, hand-finished white mother-of-pearl dial and sapphire-accented crown, the Eternelle is finished with a fluid, ultra-fine Milanese stainless steel loop.",
    details: [
      "Swiss-made Caliber 4-Jewel Quartz precision movement",
      "Exquisite natural Mother-of-Pearl dial face",
      "Scratch-proof ultra-curved Sapphire Crystal with dual AR shield",
      "316L Surgical grade stainless steel mesh or clasp strap",
      "Real cabochon sapphire inlaid in the winding crown",
      "Waterproof integrity tested to 50 meters (5 ATM)"
    ],
    specifications: {
      "Case Diameter": "28 mm",
      "Case Thickness": "6.2 mm ultra-slim profile",
      "Movement": "Swiss Ronda Caliber 762",
      "Strap Width": "14 mm",
      "Warranty": "2 Year International Luxury Warranty",
      "Taxes": "Included"
    },
    rating: 4.9,
    stock: 6,
    colors: ["Yellow Gold Blush", "Classique Rose Gold", "Platinum Silver"],
    featured: true,
    bestSeller: true
  },
  {
    id: "pe-006",
    name: "The Marquise Emerald Link Watch",
    category: "watches",
    priceINR: 24500,
    discountPriceINR: 22999,
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "An elegant cocktail watch designed to sit like fine jewelry on the wrist. Boasting an intense, guilloché imperial emerald dial framed in 18k gold plating, it is the ultimate expression of sophisticated luxury styling.",
    details: [
      "High-precision Japanese Miyota gemstone module",
      "Stellar deep guilloché emerald jade dial",
      "Multi-link interlocking jewelry bracelet with butterfly deployment",
      "Double electroplated 18k yellow gold polish",
      "Each dial has unique jade tone variations"
    ],
    specifications: {
      "Case Size": "24 mm elegant cocktail profile",
      "Thickness": "7.0 mm",
      "Strap": "Interlocking 18k Gold Plated Link Band",
      "Movement": "Miyota Japanese Quartz",
      "Taxes": "Included"
    },
    rating: 4.9,
    stock: 4,
    colors: ["Emerald Gold", "Emerald Platinum Duo"],
    featured: true,
    bestSeller: false
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { code: "THEPRIVATEEDIT", discountType: "percentage", value: 10, minPurchase: 0 },
  { code: "L007ELEVATE", discountType: "fixed", value: 2000, minPurchase: 15000 },
  { code: "FIRSTCLASS", discountType: "percentage", value: 5, minPurchase: 5000 }
];

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "TPE-9204",
    items: [
      { productId: "pe-001", name: "The Amandine Box Bag", quantity: 1, price: 14999, color: "Alabaster Ivory" }
    ],
    shippingAddress: {
      name: "Radhika Mehra",
      email: "radhika.mehra@gmail.com",
      phone: "+91-9876543210",
      street: "Apartment 4B, Signature Towers, DLF Phase 5",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      country: "India"
    },
    subtotal: 14999,
    discount: 1499.9,
    total: 13499.1,
    currency: "INR",
    status: "Shipped",
    date: "2026-05-22",
    trackingNumber: "DHL-9812A-TPE"
  },
  {
    id: "TPE-9183",
    items: [
      { productId: "pe-005", name: "The Eternelle Classic Link Watch", quantity: 1, price: 18500, color: "Classique Rose Gold" }
    ],
    shippingAddress: {
      name: "Clara Dubois",
      email: "clara.dubois@vogue.fr",
      phone: "+33-655-512-392",
      street: "Rue de l'Université, Flat 12",
      city: "Paris",
      state: "Île-de-France",
      pincode: "75007",
      country: "France"
    },
    subtotal: 18500,
    discount: 2000,
    total: 16500,
    currency: "EUR",
    status: "Delivered",
    date: "2026-05-18",
    trackingNumber: "FEDEX-88219-TPE"
  }
];

export const INITIAL_MOCK_CUSTOMERS: Customer[] = [
  { id: "cust-01", name: "Radhika Mehra", email: "radhika.mehra@gmail.com", phone: "+91-9876543210", ordersCount: 1, totalSpent: 13499.1 },
  { id: "cust-02", name: "Clara Dubois", email: "clara.dubois@vogue.fr", phone: "+33-655-512-392", ordersCount: 1, totalSpent: 16500 },
  { id: "cust-03", name: "Ananya Roy", email: "ananya.roy@outlook.in", phone: "+91-7019827653", ordersCount: 0, totalSpent: 0 }
];
