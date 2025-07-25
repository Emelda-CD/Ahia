

export type AdStatus = 'active' | 'pending' | 'declined' | 'expired';
export type RentalPeriod = 'per_day' | 'per_week' | 'per_month';

export type Ad = {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  subcategory: string;
  location: string;
  tags?: string[];
  userId?: string;
  timestamp: any;
  lastUpdated?: any;
  verified: boolean;
  status: AdStatus;
  images: string[];
  image: string; // main image
  data_ai_hint: string;
  views: number;
  
  // Conditional Fields
  // Sale/Rent
  type?: 'Sale' | 'Rent';
  rentalPeriod?: RentalPeriod;

  // Land
  plotSize?: number;
  plotMeasurementUnit?: 'Square Meters' | 'Acres' | 'Hectares';

  // Real Estate
  rooms?: number;
  toilets?: number;
  furnished?: 'Yes' | 'No';
  
  // Vehicles, Fashion, Phones, Electronics
  condition?: 'New' | 'Used' | 'Nigerian Used' | 'Foreign Used';

  // Vehicles
  make?: string;
  model?: string;
  year?: number;

  // Fashion
  fashionType?: 'Male' | 'Female';
  size?: string;
  material?: string;
  
  // Phones & Tablets / Electronics
  brand?: string;
  storage?: string; // For phones

  // Services
  serviceType?: string;
  
  // Jobs
  jobType?: 'Full-time' | 'Part-time' | 'Contract';
  position?: string;
  company?: string;
  experience?: string;
  salary?: number;
};

// Mock data for admin panel, conforming to the new 'Ad' schema
export const allAds: Ad[] = [
  {
    id: 'ad_1',
    title: 'Clean Toyota Camry 2019',
    description: 'Foreign used, accident-free with original duty. Features include a powerful V6 engine, leather seats, panoramic sunroof, and advanced safety features.',
    price: 12500000,
    category: 'Vehicles',
    subcategory: 'Cars',
    location: 'GRA, Enugu North',
    tags: ['used car', 'toyota', 'camry 2019', 'sedan'],
    userId: 'user_123',
    timestamp: new Date(),
    verified: true,
    status: 'active',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'toyota camry',
    views: 128
  },
  {
    id: 'ad_2',
    title: 'iPhone 14 Pro Max',
    description: 'Slightly used iPhone 14 Pro Max, 256GB, in perfect condition. Comes with the original box and accessories.',
    price: 950000,
    category: 'Phones',
    subcategory: 'Smartphones',
    location: 'Uwani, Enugu South',
    tags: ['iphone', 'apple', 'used phone'],
    userId: 'user_456',
    timestamp: new Date(),
    verified: false,
    status: 'pending',
    images: ['https://placehold.co/600x400.png'],
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'iphone pro',
    views: 45
  },
   {
    id: 'ad_3',
    title: '3 Bedroom Flat for Rent',
    description: 'A spacious 3 bedroom flat with modern facilities in a serene environment. Constant water and power supply.',
    price: 1200000,
    category: 'Property',
    subcategory: 'Flat',
    location: 'Independence Layout, Enugu North',
    tags: ['apartment', 'rent', 'real estate'],
    userId: 'user_789',
    timestamp: new Date(),
    verified: true,
    status: 'active',
    images: ['https://placehold.co/600x400.png'],
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'modern apartment',
    views: 210
  },
  { id: 'ad_4', title: 'Full-stack Developer Needed', price: 350000, category: 'Jobs', subcategory: 'Tech', location: 'Remote', userId: 'user_abc', timestamp: new Date(), verified: true, status: 'active', images: ['https://placehold.co/600x400.png'], image: 'https://placehold.co/600x400.png', data_ai_hint: 'code screen', views: 300, tags: ['developer', 'remote job', 'tech'] },
  { id: 'ad_5', title: 'German Shepherd Puppies', price: 150000, category: 'Animals & Pets', subcategory: 'Dogs', location: 'Abakpa, Enugu East', userId: 'user_def', timestamp: new Date(), verified: true, status: 'active', images: ['https://placehold.co/600x400.png'], image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute', views: 88, tags: ['dog', 'puppy', 'german shepherd'] },
  { id: 'ad_6', title: 'Used PlayStation 5', price: 450000, category: 'Electronics', subcategory: 'Gaming Consoles', location: 'Trans-Ekulu, Enugu East', userId: 'user_ghi', timestamp: new Date(), verified: false, status: 'pending', images: ['https://placehold.co/600x400.png'], image: 'https://placehold.co/600x400.png', data_ai_hint: 'gaming console', views: 150, tags: ['ps5', 'gaming', 'console'] },
  { id: 'ad_7', title: 'Plot of Land at Ebeano Tunnel', price: 25000000, category: 'Land', subcategory: 'Plot', location: 'GRA, Enugu North', userId: 'user_jkl', timestamp: new Date(), verified: true, status: 'active', images: ['https://placehold.co/600x400.png'], image: 'https://placehold.co/600x400.png', data_ai_hint: 'land plot', views: 50, tags: ['land', 'property', 'investment'] },
  { id: 'ad_8', title: 'Wedding Gown for Rent', price: 50000, category: 'Fashion', subcategory: 'Gown', location: 'New Haven, Enugu North', userId: 'user_mno', timestamp: new Date(), verified: false, status: 'declined', images: ['https://placehold.co/600x400.png'], image: 'https://placehold.co/600x400.png', data_ai_hint: 'wedding dress', views: 12, tags: ['wedding', 'dress', 'fashion'] },
];
