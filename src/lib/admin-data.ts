
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  data_ai_hint: string;
  joinDate: string;
  status: 'Active' | 'Suspended';
  role: 'admin' | 'user';
  listingsCount: number;
}

export const adminUsers: AdminUser[] = [
  { id: 'usr_1', name: 'John Doe', email: 'john.d@example.com', avatar: 'https://placehold.co/100x100.png', data_ai_hint: 'man portrait', joinDate: '2024-03-15', status: 'Active', role: 'user', listingsCount: 5 },
  { id: 'usr_2', name: 'Jane Smith', email: 'jane.s@example.com', avatar: 'https://placehold.co/100x100.png', data_ai_hint: 'woman portrait', joinDate: '2024-04-01', status: 'Active', role: 'admin', listingsCount: 2 },
  { id: 'usr_3', name: 'Samuel Adebayo', email: 'sam.a@example.com', avatar: 'https://placehold.co/100x100.png', data_ai_hint: 'man smiling', joinDate: '2024-05-20', status: 'Suspended', role: 'user', listingsCount: 10 },
  { id: 'usr_4', name: 'Chioma Nwosu', email: 'chioma.n@example.com', avatar: 'https://placehold.co/100x100.png', data_ai_hint: 'woman smiling', joinDate: '2024-06-11', status: 'Active', role: 'user', listingsCount: 1 },
  { id: 'usr_5', name: 'Musa Ibrahim', email: 'musa.i@example.com', avatar: 'https://placehold.co/100x100.png', data_ai_hint: 'man face', joinDate: '2024-07-02', status: 'Active', role: 'user', listingsCount: 8 },
];

export const adminStats = {
  totalUsers: 1250,
  totalListings: 5430,
  pendingApprovals: 15,
  totalRevenue: 85600,
};
