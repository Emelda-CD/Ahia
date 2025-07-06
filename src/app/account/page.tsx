
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserX } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-muted p-3 rounded-full w-fit">
                    <UserX className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle>Account System Disabled</CardTitle>
                <CardDescription>User registration and login features have been removed from this application.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    You can still browse and post ads.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
