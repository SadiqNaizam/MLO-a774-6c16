import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Custom Components
import OrderProgressStepper from '@/components/OrderProgressStepper';

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from '@/components/ui/separator';

// Lucide Icons
import { User, MapPin, CreditCard, ListOrdered, ShoppingCart, Edit2, Trash2, PlusCircle, Home, LogOut, Package, Search, Pizza } from 'lucide-react';

// Placeholder AppHeader
const PlaceholderAppHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <Pizza className="h-7 w-7 mr-2" /> Food Delivery
        </Link>
        <nav className="flex items-center space-x-4">
          <Input type="search" placeholder="Search restaurants..." className="hidden md:block w-64" />
           <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Cart</span>
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3 {/* Sample cart items count */}
              </span>
            </Button>
          </Link>
          <Link to="/user-profile">
            <Button variant="ghost">
              <User className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </Link>
           <Button variant="ghost" onClick={() => { console.log("Logout action"); navigate("/"); /* Placeholder logout */}}>
            <LogOut className="h-5 w-5 mr-0 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

// Placeholder AppFooter
const PlaceholderAppFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t py-8 text-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Food Delivery</h3>
            <p className="text-sm text-muted-foreground">Order your favorite meals from local restaurants.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/cart" className="text-sm text-muted-foreground hover:text-primary">My Cart</Link></li>
              <li><Link to="/user-profile" className="text-sm text-muted-foreground hover:text-primary">My Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">Contact Us</h3>
            <p className="text-sm text-muted-foreground">support@fooddelivery.app</p>
            <p className="text-sm text-muted-foreground">(123) 456-7890</p>
          </div>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground mt-6">&copy; {new Date().getFullYear()} Food Delivery Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be 50 characters or less." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits."}).optional().or(z.literal("")),
  bio: z.string().max(160, { message: "Bio must be 160 characters or less." }).optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Sample Data
const sampleUser = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  phone: "123-456-7890",
  bio: "Food enthusiast and avid reviewer. Loves Italian and Thai.",
  avatarUrl: "https://i.pravatar.cc/150?u=alexdoe",
};

const sampleAddresses = [
  { id: "addr1", type: "Home", line1: "123 Main St", city: "Anytown", zip: "12345", isDefault: true },
  { id: "addr2", type: "Work", line1: "456 Business Ave", city: "Anytown", zip: "67890", isDefault: false },
];

const samplePaymentMethods = [
  { id: "pay1", type: "Visa", last4: "1234", expiry: "12/25", isDefault: true },
  { id: "pay2", type: "Mastercard", last4: "5678", expiry: "06/27", isDefault: false },
];

const sampleOrders = [
  { id: "ORD001", date: "2024-07-20", total: 45.50, status: "Delivered", itemsSummary: "1x Pepperoni Pizza, 2x Coke", restaurant: "Pizza Place", currentStepIndex: 3, isActive: false },
  { id: "ORD002", date: "2024-07-28", total: 22.75, status: "Out for Delivery", itemsSummary: "1x Chicken Burger, 1x Fries", restaurant: "Burger Joint", currentStepIndex: 2, isActive: true },
  { id: "ORD003", date: "2024-07-29", total: 35.00, status: "Processing", itemsSummary: "1x Sushi Platter", restaurant: "Sushi House", currentStepIndex: 1, isActive: true },
  { id: "ORD004", date: "2024-06-10", total: 15.99, status: "Delivered", itemsSummary: "1x Pad Thai", restaurant: "Thai Express", currentStepIndex: 3, isActive: false },
];


const UserProfilePage: React.FC = () => {
  const { toast } = useToast();
  console.log('UserProfilePage loaded');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: sampleUser.name,
      email: sampleUser.email,
      phone: sampleUser.phone,
      bio: sampleUser.bio,
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile submitted:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PlaceholderAppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4 inline-block" />My Profile</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4 inline-block" />My Addresses</TabsTrigger>
            <TabsTrigger value="payments"><CreditCard className="mr-2 h-4 w-4 inline-block" />Payment Methods</TabsTrigger>
            <TabsTrigger value="orders"><ListOrdered className="mr-2 h-4 w-4 inline-block" />Order History</TabsTrigger>
          </TabsList>

          {/* My Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={sampleUser.avatarUrl} alt={sampleUser.name} />
                    <AvatarFallback>{sampleUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{sampleUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{sampleUser.email}</p>
                  </div>
                </div>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Tell us a bit about yourself" {...field} />
                          </FormControl>
                          <FormDescription>
                            A short description about your food preferences.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses.</CardDescription>
                  </div>
                  <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Address</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleAddresses.map((addr) => (
                  <Card key={addr.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <Home className="mr-2 h-5 w-5 text-primary" />
                          <h4 className="font-semibold">{addr.type} {addr.isDefault && <span className="text-xs text-green-600 ml-2">(Default)</span>}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.line1}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.zip}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {sampleAddresses.length === 0 && <p className="text-muted-foreground">No addresses saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment options.</CardDescription>
                  </div>
                  <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Card</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {samplePaymentMethods.map((pm) => (
                  <Card key={pm.id} className="p-4">
                     <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" />
                          <h4 className="font-semibold">{pm.type} ending in {pm.last4} {pm.isDefault && <span className="text-xs text-green-600 ml-2">(Default)</span>}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Expires: {pm.expiry}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {samplePaymentMethods.length === 0 && <p className="text-muted-foreground">No payment methods saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past and active orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sampleOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>Date: {new Date(order.date).toLocaleDateString()} | Restaurant: {order.restaurant}</CardDescription>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                           <span className={`text-sm px-2 py-0.5 rounded-full ${order.isActive ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {order.status}
                           </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Items: {order.itemsSummary}</p>
                      {order.isActive && (
                        <div className="my-4 p-2 border rounded-md bg-slate-50">
                          <h5 className="text-sm font-medium mb-2 text-center">Order Progress</h5>
                          <OrderProgressStepper currentStepIndex={order.currentStepIndex} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button variant="outline">View Details</Button>
                      {!order.isActive && <Button>Reorder</Button>}
                    </CardFooter>
                  </Card>
                ))}
                {sampleOrders.length === 0 && <p className="text-muted-foreground">You have no past orders.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <PlaceholderAppFooter />
    </div>
  );
};

export default UserProfilePage;