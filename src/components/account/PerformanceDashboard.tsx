
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2 } from 'lucide-react';

export default function PerformanceDashboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
            <BarChart2 className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
                <CardTitle>Performance Disabled</CardTitle>
                <CardDescription>Performance tracking requires a user account.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>User authentication has been removed from this application.</p>
            <p className="text-sm">Therefore, ad performance data is not available.</p>
        </div>
      </CardContent>
    </Card>
  );
}
