
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">Manage your admin preferences and site configuration.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>This is a placeholder for site settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Site settings controls will be available here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
