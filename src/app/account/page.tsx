import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdCard from "@/components/AdCard";
import { User, Shield, Package, Heart, Edit, Trash2, Eye } from 'lucide-react';

const myAds = [
  {
    id: '1',
    title: 'Clean Toyota Camry 2019',
    price: '12,500,000',
    location: 'Lekki, Lagos',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'toyota camry'
  },
  {
    id: '3',
    title: 'Brand New iPhone 14 Pro Max',
    price: '950,000',
    location: 'Wuse, Abuja',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'iphone pro'
  },
];

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-6 mb-12">
        <Avatar className="w-24 h-24 border-4 border-primary/50">
          <AvatarImage src="https://placehold.co/100x100.png" alt="User Name" data-ai-hint="man portrait"/>
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">User Akpan</h1>
          <p className="text-muted-foreground">Joined March 2024</p>
        </div>
      </div>

      <Tabs defaultValue="my-ads" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-col h-auto p-2 bg-card border rounded-lg items-start w-full md:w-60">
          <TabsTrigger value="profile" className="w-full justify-start gap-3 p-3 text-md">
            <User className="h-5 w-5"/> Profile Settings
          </TabsTrigger>
          <TabsTrigger value="my-ads" className="w-full justify-start gap-3 p-3 text-md">
            <Package className="h-5 w-5"/> My Ads
          </TabsTrigger>
          <TabsTrigger value="saved-listings" className="w-full justify-start gap-3 p-3 text-md">
            <Heart className="h-5 w-5"/> Saved Listings
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-3 p-3 text-md">
            <Shield className="h-5 w-5"/> Security
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="User Akpan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user.a@example.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+234 801 234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Lagos, Nigeria" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="my-ads">
             <Card>
              <CardHeader>
                <CardTitle>My Ads</CardTitle>
                <CardDescription>Manage your active and inactive listings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {myAds.map(ad => (
                  <Card key={ad.id} className="flex flex-col md:flex-row items-center gap-4 p-4">
                    <div className="w-full md:w-1/4">
                       <AdCard {...ad} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">{ad.title}</h3>
                        <p className="text-primary font-semibold">&#8358;{ad.price}</p>
                        <p className="text-muted-foreground text-sm">{ad.location}</p>
                    </div>
                    <div className="flex gap-2 self-start md:self-center">
                        <Button variant="outline" size="icon"><Eye className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </Card>
                ))}
                {myAds.length === 0 && <p className="text-center text-muted-foreground py-8">You have not posted any ads yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="saved-listings">
             <Card>
              <CardHeader>
                <CardTitle>Saved Listings</CardTitle>
                <CardDescription>Ads you have saved for later.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">You have no saved listings.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
             <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <Button>Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
