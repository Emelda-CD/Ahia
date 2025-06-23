
export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number | 'Negotiable';
  category: 'vehicles' | 'property' | 'electronics' | 'jobs' | 'animals' | 'furniture' | 'services' | 'fashion';
  image: string;
  data_ai_hint: string;
  location: {
    lga: string;
    town: string;
  };
  verifiedSeller?: boolean;
  propertyVerified?: boolean;
  verifiedID?: boolean;
  rating?: number;
  views?: number;
  contacts?: number;
  specifics?: {
    // Vehicles
    brand?: string;
    model?: string;
    year?: number;
    transmission?: 'automatic' | 'manual';
    fuelType?: string;
    // Electronics
    storage?: string;
    condition?: 'new' | 'used';
    // Property
    propertyType?: 'land' | 'shop' | 'apartment';
    size?: string;
    propertyTitle?: 'cofo' | 'deed' | 'allocation';
    // Animals
    breed?: string;
    gender?: 'male' | 'female';
    age?: string;
    // Jobs
    jobType?: 'full-time' | 'part-time' | 'remote';
    salaryRange?: string;
    experienceLevel?: string;
  };
};

export const allListings: Listing[] = [
  {
    id: '1',
    title: 'Clean Toyota Camry 2019',
    description: 'Foreign used, accident-free with original duty.',
    price: 12500000,
    category: 'vehicles',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'toyota camry',
    location: { lga: 'Enugu North', town: 'GRA' },
    verifiedSeller: true,
    rating: 4.8,
    views: 890,
    contacts: 45,
    specifics: { brand: 'Toyota', model: 'Camry', year: 2019, transmission: 'automatic' },
  },
  {
    id: '2',
    title: 'Luxury 3-Bedroom Flat for Rent',
    description: 'A spacious and modern 3-bedroom flat with all amenities in a serene environment.',
    price: 3500000,
    category: 'property',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'modern apartment',
    location: { lga: 'Enugu East', town: 'Trans-Ekulu' },
    propertyVerified: true,
    verifiedSeller: true,
    rating: 4.9,
    views: 1200,
    contacts: 80,
    specifics: { propertyType: 'apartment', propertyTitle: 'deed' },
  },
  {
    id: '3',
    title: 'Brand New iPhone 14 Pro Max',
    description: 'Slightly used iPhone 14 Pro Max, 256GB, in perfect condition.',
    price: 950000,
    category: 'electronics',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'iphone pro',
    location: { lga: 'Enugu South', town: 'Uwani' },
    verifiedID: true,
    rating: 4.5,
    views: 650,
    contacts: 30,
    specifics: { brand: 'Apple', storage: '256gb', condition: 'used' },
  },
  {
    id: '4',
    title: 'Digital Marketing Expert Needed',
    description: 'We are looking for an experienced digital marketer to join our team.',
    price: 'Negotiable',
    category: 'jobs',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'office desk',
    location: { lga: 'Enugu North', town: 'Ogui' },
    verifiedSeller: true,
    rating: 5.0,
    specifics: { jobType: 'remote', experienceLevel: 'Mid-Senior' },
  },
  {
    id: '8',
    title: 'German Shepherd Puppy',
    description: '8 weeks old purebred German Shepherd puppy. Vaccinated and dewormed.',
    price: 150000,
    category: 'animals',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'puppy cute',
    location: { lga: 'Udi', town: 'Udi Urban' },
    verifiedSeller: true,
    views: 250,
    contacts: 15,
    specifics: { breed: 'German Shepherd', gender: 'male', age: '8 weeks' },
  },
   {
    id: '5',
    title: 'HP Spectre x360 Laptop',
    description: 'Core i7, 16GB RAM, 512GB SSD. Barely used.',
    price: 750000,
    category: 'electronics',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'laptop computer',
    location: { lga: 'Nsukka', town: 'Obukpa' },
    verifiedID: true,
    rating: 4.2,
    specifics: { brand: 'HP', storage: '512gb', condition: 'used' },
  },
  {
    id: '6',
    title: '1 Plot of Land in Awkunanaw',
    description: 'Fenced plot of land with C of O. Good for residential building.',
    price: 8000000,
    category: 'property',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'land plot',
    location: { lga: 'Enugu South', town: 'Awkunanaw' },
    propertyVerified: true,
    verifiedSeller: true,
    rating: 4.9,
    specifics: { propertyType: 'land', size: '1 plot', propertyTitle: 'cofo' },
  },
  {
    id: '7',
    title: 'Honda CR-V 2018',
    description: 'Tokunbo Honda CR-V 2018 model. Excellent condition.',
    price: 15000000,
    category: 'vehicles',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'honda crv',
    location: { lga: 'Igbo Eze North', town: 'Enugu-Ezike' },
    verifiedID: true,
    rating: 4.6,
    views: 950,
    contacts: 55,
    specifics: { brand: 'Honda', model: 'CR-V', year: 2018, transmission: 'automatic' },
  },
   {
    id: '9',
    title: 'Male Boerboel for sale',
    description: 'Pure boerboel for sale, male, very active.',
    price: 350000,
    category: 'animals',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'boerboel dog',
    location: { lga: 'Ezeagu', town: 'Aguobu-Owa' },
    verifiedSeller: false,
    rating: 3.8,
    views: 180,
    contacts: 10,
    specifics: { breed: 'Boerboel', gender: 'male', age: '1 year' },
  },
  {
    id: '10',
    title: 'Samsung Galaxy S22 Ultra',
    description: 'UK Used Samsung S22 Ultra, 128GB. No cracks or scratches.',
    price: 450000,
    category: 'electronics',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'samsung phone',
    location: { lga: 'Enugu North', town: 'Ogui' },
    verifiedSeller: true,
    verifiedID: true,
    rating: 4.9,
    views: 720,
    contacts: 60,
    specifics: { brand: 'Samsung', storage: '128gb', condition: 'used' },
  },
  {
    id: '11',
    title: 'Designer Leather Handbag',
    description: 'A stylish leather handbag from a top designer. Perfect for all occasions.',
    price: 75000,
    category: 'fashion',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'leather handbag',
    location: { lga: 'Enugu North', town: 'GRA' },
    verifiedSeller: true,
    rating: 4.8,
    specifics: { condition: 'new', brand: 'Designer Brand' },
  },
  {
    id: '12',
    title: 'Men\'s Formal Shoes',
    description: 'Classic black leather shoes for formal wear. Size 42.',
    price: 45000,
    category: 'fashion',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'mens shoes',
    location: { lga: 'Enugu South', town: 'Uwani' },
    verifiedID: true,
    rating: 4.6,
    specifics: { condition: 'new', brand: 'Fashion Co' },
  },
];
