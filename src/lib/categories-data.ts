
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
      "Land for Sale",
      "Land for Rent",
      "Commercial Land",
      "Residential Land",
      "Agricultural Land",
      "Joint Venture Land"
    ],
    sort_order: 1
  },
  {
    name: "Phones",
    slug: "phones",
    icon: "📱",
    subcategories: [
      "iPhones",
      "Samsung",
      "Tecno",
      "Infinix",
      "Other Phones",
      "Phone Accessories"
    ],
    sort_order: 2
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    icon: "🚗",
    subcategories: [
      "Cars",
      "Motorcycles",
      "Trucks",
      "Vehicle Parts",
      "Buses",
      "Trailers"
    ],
    sort_order: 3
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    subcategories: [
      "Laptops",
      "TVs",
      "Home Theaters",
      "Refrigerators",
      "Cameras",
      "Accessories"
    ],
    sort_order: 4
  },
  {
    name: "Jobs",
    slug: "jobs",
    icon: "💼",
    subcategories: [
      "IT Jobs",
      "Teaching Jobs",
      "Driving Jobs",
      "Customer Service",
      "Accounting & Finance",
      "Others"
    ],
    sort_order: 5
  },
  {
    name: "Animals & Pets",
    slug: "animals-pets",
    icon: "🐾",
    subcategories: [
      "Dogs",
      "Cats",
      "Birds",
      "Fish",
      "Pet Accessories",
      "Others"
    ],
    sort_order: 6
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    subcategories: [
      "Men’s Fashion",
      "Women’s Fashion",
      "Shoes",
      "Bags",
      "Watches",
      "Jewelry"
    ],
    sort_order: 7
  },
  {
    name: 'Property',
    slug: 'property',
    icon: '🌍',
    subcategories: [
      'Houses & Apartments for Sale',
      'Houses & Apartments for Rent',
      'Commercial Property for Sale',
      'Commercial Property for Rent',
      'Event Centres & Venues',
    ],
    sort_order: 8,
  },
  {
      name: 'Furniture & Home',
      slug: 'furniture-home',
      icon: '🛋️',
      subcategories: ['Sofas & Chairs', 'Beds & Mattresses', 'Tables & Desks', 'Home Decor', 'Kitchen Appliances'],
      sort_order: 9
  },
  {
      name: 'Services',
      slug: 'services',
      icon: '🔧',
      subcategories: ['Automotive Services', 'Health & Wellness', 'Legal & Financial', 'Events & Catering', 'Cleaning Services'],
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
