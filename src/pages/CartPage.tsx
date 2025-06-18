import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

// Placeholder AppHeader component
const AppHeader: React.FC = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-600">
        FoodFleet
      </Link>
      <nav className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/cart">
          <Button variant="ghost">
            <ShoppingCart className="h-5 w-5 mr-1" /> Cart
          </Button>
        </Link>
        <Link to="/user-profile">
          <Button variant="outline">Profile</Button>
        </Link>
      </nav>
    </div>
  </header>
);

// Placeholder AppFooter component
const AppFooter: React.FC = () => (
  <footer className="bg-gray-800 text-white py-8 mt-auto">
    <div className="container mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link to="/about" className="hover:underline text-sm">About Us</Link>
        <Link to="/contact" className="hover:underline text-sm">Contact</Link>
        <Link to="/privacy" className="hover:underline text-sm">Privacy Policy</Link>
      </div>
    </div>
  </footer>
);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantSlug?: string; // Optional: to link back to the restaurant
}

const initialCartItems: CartItem[] = [
  { id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60', restaurantSlug: 'pizza-place' },
  { id: '2', name: 'Classic Burger Meal', price: 15.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60', restaurantSlug: 'burger-joint' },
  { id: '3', name: 'Sushi Platter', price: 22.00, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60', restaurantSlug: 'sushi-spot' },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
    // Here you might fetch cart items from local storage or an API in a real app
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Optionally, confirm before removing or set minimum quantity to 1
      // For now, let's just ensure it doesn't go below 1 from input directly
      // Remove item if quantity becomes 0 via +/- buttons
      removeItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const incrementQuantity = (id: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08; // Example tax rate 8%
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example delivery fee
  const total = subtotal + estimatedTax + deliveryFee;

  const handleProceedToCheckout = () => {
    // In a real app, you might save the cart to state/context or pass it
    console.log("Proceeding to checkout with items:", cartItems);
    navigate('/checkout'); // Path from App.tsx
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <CardTitle className="text-2xl font-semibold">Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center w-[150px]">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center w-[50px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>{item.name}</div>
                            {item.restaurantSlug && (
                                <Link to={`/restaurant-menu?slug=${item.restaurantSlug}`} className="text-xs text-blue-600 hover:underline">
                                    From {item.restaurantSlug.replace('-', ' ')}
                                </Link>
                            )}
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => decrementQuantity(item.id)}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="w-12 h-8 text-center focus-visible:ring-transparent"
                                min="1"
                              />
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => incrementQuantity(item.id)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24"> {/* Make summary sticky on larger screens */}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
};

export default CartPage;