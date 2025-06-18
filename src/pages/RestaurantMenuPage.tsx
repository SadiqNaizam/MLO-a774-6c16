import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Custom Components
import MenuItemCard from '@/components/MenuItemCard';

// Shadcn/ui Components
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Lucide Icons
import { Star, Clock, Utensils, ShoppingCart, Home, User, MapPin } from 'lucide-react';

// Placeholder data for a restaurant
const placeholderRestaurant = {
  defaultSlug: 'default-good-eats',
  name: 'Good Eats Diner',
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  rating: 4.7,
  cuisineTypes: ['American', 'Comfort Food', 'Burgers'],
  operatingHours: '8:00 AM - 11:00 PM',
  address: '123 Main Street, Anytown, USA',
  description: 'Your friendly neighborhood diner serving up all your favorite comfort foods, from hearty breakfasts to delicious burgers and milkshakes. Join us for a taste of home!',
};

const placeholderMenuItems = [
  { id: 'menuItem1', name: 'Classic Cheeseburger', description: 'A juicy beef patty topped with cheddar cheese, lettuce, tomato, and pickles on a toasted bun. Served with fries.', price: 13.50, imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  { id: 'menuItem2', name: 'Chicken Tenders Platter', description: 'Crispy golden chicken tenders served with your choice of dipping sauce and a side of coleslaw.', price: 11.99, imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2tlbiUyMHRlbmRlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: 'menuItem3', name: 'Veggie Delight Sandwich', description: 'Grilled vegetables, provolone cheese, and pesto mayo on multigrain bread. Served with a side salad.', price: 10.75, imageUrl: 'https://images.unsplash.com/photo-1592415486658-c3049390384f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZ2llJTIwc2FuZHdpY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { id: 'menuItem4', name: 'Strawberry Milkshake', description: 'A thick and creamy milkshake made with real strawberries and vanilla ice cream, topped with whipped cream.', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1626827689299-5405b855bce9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXdiZXJyeSUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
  { id: 'menuItem5', name: 'Pancakes Stack', description: 'Fluffy buttermilk pancakes served with maple syrup and butter. Add blueberries or chocolate chips!', price: 9.25, imageUrl: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuY2FrZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
];

interface CartQuantities {
  [itemId: string]: number;
}

const RestaurantMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const restaurantSlug = searchParams.get('slug') || placeholderRestaurant.defaultSlug;

  // For this example, we'll use the placeholder data regardless of slug,
  // but in a real app, you'd fetch data based on restaurantSlug.
  const [restaurantDetails] = useState(placeholderRestaurant);
  const [menuItems] = useState(placeholderMenuItems);
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});

  useEffect(() => {
    console.log('RestaurantMenuPage loaded for slug:', restaurantSlug);
    // Here you would typically fetch restaurant and menu data based on restaurantSlug
    // For now, we initialize cart quantities based on placeholder menu items
    const initialQuantities: CartQuantities = {};
    menuItems.forEach(item => {
      initialQuantities[item.id] = 0; // Or load from local storage/context
    });
    setCartQuantities(initialQuantities);
  }, [restaurantSlug, menuItems]);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    setCartQuantities(prevQuantities => ({
      ...prevQuantities,
      [String(itemId)]: newQuantity,
    }));
  };

  const totalCartItems = Object.values(cartQuantities).reduce((sum, quantity) => sum + (quantity || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* AppHeader - Implemented as a standard <header> HTML element */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodApp
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors flex items-center">
              <Home className="h-5 w-5 mr-1" /> Home
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-primary transition-colors flex items-center">
              <ShoppingCart className="h-5 w-5 mr-1" /> Cart ({totalCartItems})
            </Link>
            <Link to="/user-profile" className="text-gray-600 hover:text-primary transition-colors flex items-center">
              <User className="h-5 w-5 mr-1" /> Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurantDetails.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Restaurant Info Section */}
        <section className="mb-8">
          <Card className="overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-2/5 lg:w-1/3">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <img
                    src={restaurantDetails.imageUrl}
                    alt={`Image of ${restaurantDetails.name}`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              <div className="md:w-3/5 lg:w-2/3 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-3xl font-bold text-gray-800">{restaurantDetails.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span>{restaurantDetails.rating.toFixed(1)} Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-1" />
                      <span>{restaurantDetails.cuisineTypes.join(', ')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3 flex-grow">
                  <CardDescription className="text-base text-gray-600 mb-3">
                    {restaurantDetails.description}
                  </CardDescription>
                   <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{restaurantDetails.address}</span>
                    </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Operating Hours: {restaurantDetails.operatingHours}</span>
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                        {restaurantDetails.cuisineTypes.map(cuisine => (
                            <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                        ))}
                    </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </section>

        {/* Menu Items Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">Menu</h2>
          <ScrollArea className="h-[65vh] lg:h-[70vh] -mx-2 px-2"> {/* Negative margin to extend scroll area slightly for better edge visibility with padding */}
            {menuItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    id={item.id}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    initialQuantity={cartQuantities[item.id] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">No menu items available at the moment.</p>
            )}
          </ScrollArea>
        </section>

        {/* Floating View Cart Button - more prominent for mobile */}
        <div className="fixed bottom-4 right-4 z-40 sm:hidden">
            <Link to="/cart">
                <Button size="lg" className="rounded-full shadow-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" /> ({totalCartItems})
                </Button>
            </Link>
        </div>
      </main>

      {/* AppFooter - Implemented as a standard <footer> HTML element */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
          <div className="mt-1">
             <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;