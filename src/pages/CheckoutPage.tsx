import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner'; // Using sonner for toasts as per App.tsx
import { ShoppingCart, CreditCard, Home, ShieldCheck, Package, Zap } from 'lucide-react';

// Mock AppHeader structure
const AppHeader = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-primary flex items-center">
        <Zap className="h-7 w-7 mr-2 text-amber-500" />
        FoodFleet
      </Link>
      <nav className="flex items-center space-x-4">
        <Link to="/cart" className="text-gray-600 hover:text-primary flex items-center">
          <ShoppingCart className="h-5 w-5 mr-1" />
          Cart
        </Link>
        <Link to="/user-profile" className="text-gray-600 hover:text-primary">
          Profile
        </Link>
      </nav>
    </div>
  </header>
);

// Mock AppFooter structure
const AppFooter = () => (
  <footer className="bg-gray-100 border-t mt-auto">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
      <p>&copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <Link to="/privacy" className="hover:text-primary text-sm">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary text-sm">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

const checkoutFormSchema = z.object({
  // Delivery Address
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  streetAddress: z.string().min(5, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid postal code format." }),
  country: z.string().min(2, { message: "Country is required." }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number."}).optional(),

  // Payment Method
  paymentMethod: z.enum(['creditCard', 'paypal'], { required_error: "Please select a payment method." }),
  cardholderName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(), // MM/YY
  cardCvc: z.string().optional(),
  savePaymentDetails: z.boolean().default(false).optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'creditCard') {
    if (!data.cardholderName || data.cardholderName.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cardholder name is required.", path: ['cardholderName']});
    }
    if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid card number is required.", path: ['cardNumber']});
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid expiry date (MM/YY) is required.", path: ['cardExpiry']});
    }
    if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid CVC (3 or 4 digits) is required.", path: ['cardCvc']});
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Mock cart items for summary
const mockCartItems = [
  { id: '1', name: 'Spicy Ramen Bowl', price: 12.99, quantity: 1, imageUrl: 'https://via.placeholder.com/100?text=Ramen' },
  { id: '2', name: 'Gyoza (6 pcs)', price: 6.50, quantity: 2, imageUrl: 'https://via.placeholder.com/100?text=Gyoza' },
  { id: '3', name: 'Green Tea', price: 2.00, quantity: 1, imageUrl: 'https://via.placeholder.com/100?text=Tea' },
];

const CheckoutPage = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      streetAddress: '',
      city: '',
      postalCode: '',
      country: 'USA', // Default country
      paymentMethod: 'creditCard',
      savePaymentDetails: false,
    },
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 5.00; // Example shipping
  const taxRate = 0.08; // 8% tax
  const taxes = subtotal * taxRate;
  const totalAmount = subtotal + shippingFee + taxes;

  function onSubmit(data: CheckoutFormValues) {
    console.log('Checkout form submitted:', data);
    toast.success('Order Placed!', {
      description: 'Thank you for your order. You will be redirected to your profile shortly.',
      duration: 3000,
      action: {
        label: "Track Order",
        onClick: () => navigate('/user-profile') // Path from App.tsx
      }
    });
    // Simulate API call and redirect
    setTimeout(() => {
      navigate('/user-profile'); // Path from App.tsx
    }, 3000);
  }

  const paymentMethod = form.watch('paymentMethod');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center sm:text-left">
          Secure Checkout
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Delivery & Payment Forms */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Home className="mr-2 h-6 w-6 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="CAN">Canada</SelectItem>
                              <SelectItem value="GBR">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 555 123 4567" {...field} />
                        </FormControl>
                        <FormDescription>For delivery updates.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CreditCard className="mr-2 h-6 w-6 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="creditCard" />
                              </FormControl>
                              <FormLabel className="font-normal">Credit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" disabled />
                              </FormControl>
                              <FormLabel className="font-normal text-gray-400">PayPal (Coming Soon)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === 'creditCard' && (
                    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                      <FormField
                        control={form.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John M. Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="•••• •••• •••• ••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardCvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                       <FormField
                        control={form.control}
                        name="savePaymentDetails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-white">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Save payment details for next time
                              </FormLabel>
                              <FormDescription>
                                Your payment information will be stored securely.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24"> {/* Sticky for visibility on scroll */}
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Package className="mr-2 h-6 w-6 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-3" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping</p>
                      <p>${shippingFee.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Taxes ({(taxRate * 100).toFixed(0)}%)</p>
                      <p>${taxes.toFixed(2)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <p>Total</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Processing..." : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" /> Place Secure Order
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <AppFooter />
    </div>
  );
};

export default CheckoutPage;