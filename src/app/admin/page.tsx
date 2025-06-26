import AdminStats from '@/components/admin/AdminStats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import UsersTable from '@/components/admin/UsersTable';
import ListingsTable from '@/components/admin/ListingsTable';


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin!</p>
      </div>

      <AdminStats />

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>The last 5 users who joined the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <UsersTable limit={5} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Pending Listings</CardTitle>
                <CardDescription>Listings waiting for your approval.</CardDescription>
            </CardHeader>
            <CardContent>
                <ListingsTable limit={5} filter="Pending" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
