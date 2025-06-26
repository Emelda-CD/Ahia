import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, CircleDollarSign, BadgeCheck } from 'lucide-react';
import { adminStats } from '@/lib/admin-data';

const StatCard = ({ icon: Icon, title, value, change }: { icon: React.ElementType, title: string, value: string | number, change?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && <p className="text-xs text-muted-foreground">{change}</p>}
    </CardContent>
  </Card>
);

export default function AdminStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} title="Total Users" value={adminStats.totalUsers.toLocaleString()} change="+20.1% from last month" />
            <StatCard icon={Package} title="Total Listings" value={adminStats.totalListings.toLocaleString()} change="+18.3% from last month" />
            <StatCard icon={CircleDollarSign} title="Total Revenue" value={`₦${adminStats.totalRevenue.toLocaleString()}`} change="+12.5% from last month" />
            <StatCard icon={BadgeCheck} title="Pending Approvals" value={adminStats.pendingApprovals.toLocaleString()} />
        </div>
    )
}
