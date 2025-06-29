
export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number | 'Negotiable';
  category: string;
  subcategory: string;
  image: string; // This will be the main image URL
  images: string[]; // All image URLs
  data_ai_hint: string;
  location: {
    lga: string;
    town: string;
  };
  sellerId: string;
  verifiedSeller?: boolean;
  propertyVerified?: boolean;
  verifiedID?: boolean;
  rating?: number;
  views?: number;
  contacts?: number;
  favorites?: number;
  promoted?: boolean;
  createdAt?: any;
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
    listingType?: 'sale' | 'rent'; // For property and maybe vehicles
    landUse?: 'residential' | 'commercial' | 'agricultural'; // for land
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

// Mock data is no longer the primary source, but can be kept for reference or testing.
export const allListings: Listing[] = [];
