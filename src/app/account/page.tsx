
'use client';

import { useState, useRef } from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { locations } from '@/lib/locations';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import AdCard from "@/components/AdCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Package, Heart, Edit, Trash2, Eye, Camera, Calendar as CalendarIcon, Mail, KeyRound, Bell, LogOut, Trash, Facebook, CheckCircle, CircleHelp, ExternalLink, Phone, UserCheck, Building, AlertCircle, PhoneCall, Upload, Loader2, BadgeCheck } from 'lucide-react';

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

const lgas = Object.keys(locations);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.78 2.04-5.78 0-9.5-4.26-9.5-9.8s3.72-9.8 9.5-9.8c2.8 0 4.93 1.05 6.4 2.45l2.4-2.38C19.2 1.11 16.2.36 12.48.36c-6.9 0-12.13 5.3-12.13 11.97s5.23 11.97 12.13 11.97c6.7 0 11.7-4.4 11.7-11.52 0-.76-.1-1.45-.24-2.04z"/></svg>
);


export default function AccountPage() {
    const [date, setDate] = useState<Date>();
    const [idStatus, setIdStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');
    const [businessStatus, setBusinessStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');
    const [profileImage, setProfileImage] = useState("https://placehold.co/100x100.png");

    const idFileInputRef = useRef<HTMLInputElement>(null);
    const businessFileInputRef = useRef<HTMLInputElement>(null);
    const profileImageInputRef = useRef<HTMLInputElement>(null);

    const handleProfileImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIdUpload = () => {
        setIdStatus('pending');
        setTimeout(() => {
            // In a real app, this would be based on an API response.
            // We'll simulate a successful verification.
            setIdStatus('verified');
        }, 3000); // 3-second delay to simulate review
    };
    
    const handleIdFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("ID document selected:", file.name);
            // In a real app, you would upload the file here.
            handleIdUpload();
        }
    };
    
    const handleBusinessDocUpload = () => {
        setBusinessStatus('pending');
        setTimeout(() => {
            // Simulate a rejection for demonstration
            setBusinessStatus('rejected');
        }, 3000);
    };

    const handleBusinessFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Business document selected:", file.name);
            // In a real app, you would upload the file here.
            handleBusinessDocUpload();
        }
    };

    const resetIdVerification = () => {
        setIdStatus('unverified');
    };

    const resetBusinessVerification = () => {
        setBusinessStatus('unverified');
    };


  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-6 mb-12">
        <Avatar className="w-24 h-24 border-4 border-primary/50">
          <AvatarImage src={profileImage} alt="User Name" data-ai-hint="man portrait"/>
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">User Akpan</h1>
          <p className="text-muted-foreground">Joined March 2024</p>
        </div>
      </div>

      <Tabs defaultValue="account-settings" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-col h-auto p-2 bg-card border rounded-lg items-start w-full md:w-60">
          <TabsTrigger value="account-settings" className="w-full justify-start gap-3 p-3 text-md">
            <User className="h-5 w-5"/> Account Settings
          </TabsTrigger>
          <TabsTrigger value="my-ads" className="w-full justify-start gap-3 p-3 text-md">
            <Package className="h-5 w-5"/> My Ads
          </TabsTrigger>
          <TabsTrigger value="saved-listings" className="w-full justify-start gap-3 p-3 text-md">
            <Heart className="h-5 w-5"/> Saved Listings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="account-settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile, preferences, and account security.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={['personal-details', 'identity-verification']} className="w-full">
                    
                    <AccordionItem value="personal-details">
                        <AccordionTrigger className="text-lg font-semibold">Personal Details</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={profileImage} data-ai-hint="man portrait"/>
                                        <AvatarFallback>UA</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-background" onClick={() => profileImageInputRef.current?.click()}>
                                        <Camera className="h-4 w-4"/>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={profileImageInputRef}
                                        onChange={handleProfileImageSelect}
                                        className="hidden"
                                        accept="image/jpeg,image/png"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Profile Photo</h4>
                                    <p className="text-sm text-muted-foreground">Upload a new photo.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" defaultValue="User" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Akpan" />
                                </div>
                            </div>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Select defaultValue="Enugu North">
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {lgas.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Birthday</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn( "w-full justify-start text-left font-normal", !date && "text-muted-foreground" )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label>Sex</Label>
                                    <RadioGroup defaultValue="unspecified" className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="unspecified" id="unspecified" /><Label htmlFor="unspecified">Do not specify</Label></div>
                                    </RadioGroup>
                                 </div>
                                  <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ig">Igbo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button>Save Personal Details</Button>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="business-details">
                        <AccordionTrigger className="text-lg font-semibold">Business Details (Optional)</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="business-name">Business Name</Label>
                                <Input id="business-name" placeholder="e.g., John Motors" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="business-location">Business Location</Label>
                                <Input id="business-location" placeholder="e.g., Shop 12, Market Road" />
                            </div>
                            <div className="space-y-2">
                                <Label>Registered</Label>
                                <RadioGroup defaultValue="no" className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="yes" /><Label htmlFor="yes">Registered</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">Not Registered</Label></div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-person">Contact Person</Label>
                                <Input id="contact-person" placeholder="e.g., Jane Doe" />
                            </div>
                             <Button>Save Business Details</Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="identity-verification">
                        <AccordionTrigger className="text-lg font-semibold">Identity & Verification</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Phone className="h-6 w-6 text-muted-foreground"/>
                                        <div>
                                            <h4 className="font-semibold">Phone Number</h4>
                                            <p className="text-sm font-mono">+234 801 234 5678</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 mr-1"/> Verified</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Mail className="h-6 w-6 text-muted-foreground"/>
                                        <div>
                                            <h4 className="font-semibold">Email Address</h4>
                                            <p className="text-sm">user.a@example.com</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Verify Now</Button>
                                </div>
                                <div className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <UserCheck className="h-6 w-6 text-muted-foreground"/>
                                            <div>
                                                <h4 className="font-semibold">ID Verification</h4>
                                                <p className="text-sm text-muted-foreground">Verify using your Gov-issued ID.</p>
                                            </div>
                                        </div>
                                        {idStatus === 'unverified' && <Button onClick={() => idFileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4"/> Upload ID</Button>}
                                        {idStatus === 'pending' && <Badge variant="outline" className="text-amber-600 border-amber-500"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Pending</Badge>}
                                        {idStatus === 'verified' && <Badge variant="secondary" className="bg-green-100 text-green-800"><BadgeCheck className="mr-2 h-4 w-4"/> Verified</Badge>}
                                        {idStatus === 'rejected' && <Button variant="destructive" onClick={resetIdVerification}><AlertCircle className="mr-2 h-4 w-4"/> Re-upload</Button>}
                                    </div>
                                    <input
                                        type="file"
                                        ref={idFileInputRef}
                                        onChange={handleIdFileSelect}
                                        className="hidden"
                                        accept="image/jpeg,image/png,application/pdf"
                                    />
                                    {idStatus === 'rejected' && <Alert variant="destructive" className="mt-3"><AlertCircle className="h-4 w-4"/><AlertTitle>Verification Rejected</AlertTitle><AlertDescription>Your ID was not clear. Please upload again.</AlertDescription></Alert>}
                                </div>

                                <div className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Building className="h-6 w-6 text-muted-foreground"/>
                                            <div>
                                                <h4 className="font-semibold">Business Verification</h4>
                                                <p className="text-sm text-muted-foreground">Verify your business with CAC documents.</p>
                                            </div>
                                        </div>
                                        {businessStatus === 'unverified' && <Button onClick={() => businessFileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4"/> Upload Docs</Button>}
                                        {businessStatus === 'pending' && <Badge variant="outline" className="text-amber-600 border-amber-500"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Pending</Badge>}
                                        {businessStatus === 'verified' && <Badge variant="secondary" className="bg-green-100 text-green-800"><BadgeCheck className="mr-2 h-4 w-4"/> Verified</Badge>}
                                        {businessStatus === 'rejected' && <Button variant="destructive" onClick={resetBusinessVerification}><AlertCircle className="mr-2 h-4 w-4"/> Re-upload</Button>}
                                    </div>
                                    <input
                                        type="file"
                                        ref={businessFileInputRef}
                                        onChange={handleBusinessFileSelect}
                                        className="hidden"
                                        accept="image/jpeg,image/png,application/pdf"
                                    />
                                     {businessStatus === 'rejected' && <Alert variant="destructive" className="mt-3"><AlertCircle className="h-4 w-4"/><AlertTitle>Verification Rejected</AlertTitle><AlertDescription>Your documents could not be verified.</AlertDescription></Alert>}
                                </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="preferences">
                        <AccordionTrigger className="text-lg font-semibold">Preferences</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <Label htmlFor="disable-chats" className="flex-1">Disable Chats</Label>
                                <Switch id="disable-chats" />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <Label htmlFor="disable-feedback" className="flex-1">Disable Feedback</Label>
                                <Switch id="disable-feedback" />
                            </div>
                             <div className="flex items-center justify-between p-4 border rounded-lg">
                                <Label className="flex-1">Manage Notifications</Label>
                                <Button variant="outline" size="sm">Settings <ExternalLink className="h-4 w-4 ml-2"/></Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="connected-accounts">
                        <AccordionTrigger className="text-lg font-semibold">Connected Accounts</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <Button variant="outline" className="w-full justify-start gap-4">
                                <GoogleIcon className="h-5 w-5"/> Connect with Google
                            </Button>
                            <Button disabled variant="outline" className="w-full justify-between">
                                <div className="flex items-center gap-4">
                                    <Facebook className="h-5 w-5 text-blue-600"/>
                                    <span>Connected with Facebook</span>
                                </div>
                                <CheckCircle className="h-5 w-5 text-green-600"/>
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-4">
                                <PhoneCall className="h-5 w-5 text-blue-500"/> Connect with Truecaller
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="security">
                        <AccordionTrigger className="text-lg font-semibold">Security</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <h4 className="font-medium">Change Password</h4>
                             <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button>Update Password</Button>
                            <div className="!mt-8 flex justify-between items-center p-4 border border-destructive/50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-destructive">Delete My Account</h4>
                                    <p className="text-sm text-muted-foreground">This action is permanent and cannot be undone.</p>
                                </div>
                                <Button variant="destructive"><Trash className="mr-2 h-4 w-4"/> Delete</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
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
        </div>
      </Tabs>
    </div>
  );
}
