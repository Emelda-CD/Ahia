
export interface Category {
  name: string;
  slug: string;
  icon?: string;
  subcategories: string[];
  sort_order: number;
}

export const categoriesData: Category[] = [
  {
    name: "Land",
    slug: "land",
    icon: "🌍",
    subcategories: [
      "Plot", "Farmland", "Farm Estate", "Commercial Land", "Residential Land", "Joint Venture Land"
    ],
    sort_order: 1
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: '🏢',
    subcategories: [
      'Flat', 'House', 'Shop', 'Self-contained', 'Commercial Property', 'Event Centres & Venues'
    ],
    sort_order: 2,
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    icon: "🚗",
    subcategories: [
      "Car", "Motorcycle", "Truck", "Bus", "Vehicle Parts", "Trailer"
    ],
    sort_order: 3
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    subcategories: [
      "Dress", "Gown", "Trousers", "Skirt", "Hair Tie", "Shoes", "Bags", "Watches", "Jewelry"
    ],
    sort_order: 4
  },
   {
    name: "Phones & Tablets",
    slug: "phones-tablets",
    icon: "📱",
    subcategories: [
      "Smartphones", "Tablets", "Other Phones", "Phone Accessories"
    ],
    sort_order: 5
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    subcategories: [
      "TVs", "Speakers", "Refrigerators", "Laptops", "Home Theaters", "Cameras", "Accessories"
    ],
    sort_order: 6
  },
  {
    name: "Services",
    slug: "services",
    icon: '🔧',
    subcategories: ["Cleaning", "Plumbing", "Event Planning", 'Automotive Services', 'Health & Wellness', 'Legal & Financial', 'Catering'],
    sort_order: 7
  },
  {
    name: "Jobs",
    slug: "jobs",
    icon: "💼",
    subcategories: [
      "Accounting", "Tech", "Customer Service", "IT Jobs", "Teaching Jobs", "Driving Jobs", "Others"
    ],
    sort_order: 8
  },
  {
    name: "Animals & Pets",
    slug: "animals-pets",
    icon: "🐾",
    subcategories: [
      "Dogs", "Cats", "Birds", "Fish", "Pet Accessories", "Others"
    ],
    sort_order: 9
  },
  {
      name: 'Furniture & Home',
      slug: 'furniture-home',
      icon: '🛋️',
      subcategories: ['Sofas & Chairs', 'Beds & Mattresses', 'Tables & Desks', 'Home Decor', 'Kitchen Appliances'],
      sort_order: 10
  },
  {
    name: "Food, Agriculture & Farming",
    slug: "food-agriculture-farming",
    icon: "🌱",
    subcategories: [
      "Fresh Produce",
      "Livestock & Poultry",
      "Farm Machinery & Equipment",
      "Fertilizers & Agro-chemicals",
      "Seeds & Seedlings",
    ],
    sort_order: 11
  }
].sort((a, b) => a.sort_order - b.sort_order);
