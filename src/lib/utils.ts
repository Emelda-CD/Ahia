import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryIcons: { [key: string]: React.ElementType } = {
    Property: "Home",
    Land: "LandPlot",
    Electronics: "Sparkles",
    Vehicles: "Car",
    Jobs: "Briefcase",
    'Animals & Pets': "PawPrint",
    'Furniture & Home': "Sofa",
    Services: "Wrench",
    Fashion: "Shirt",
    'Phones & Tablets': "Sparkles",
    'Food, Agriculture & Farming': "Leaf",
};

    