
export interface BoostPlan {
  id: string;
  name: string;
  type: 'top-ad';
  duration_days: number;
  price: number;
}

export const boostPlans: BoostPlan[] = [
  {
    id: 'basic_7',
    name: 'Basic Boost – 7 Days',
    type: 'top-ad',
    duration_days: 7,
    price: 500,
  },
  {
    id: 'premium_14',
    name: 'Top Ad Boost – 14 Days',
    type: 'top-ad',
    duration_days: 14,
    price: 1000,
  },
];
