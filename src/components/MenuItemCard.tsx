import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  initialQuantity?: number;
  onQuantityChange: (itemId: string | number, newQuantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  imageUrl,
  name,
  description,
  price,
  initialQuantity = 0,
  onQuantityChange,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);
  const { toast } = useToast();

  console.log('MenuItemCard loaded for:', name, 'with initial quantity:', initialQuantity);

  useEffect(() => {
    setCurrentQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleSetQuantity = (newQuantity: number) => {
    const clampedQuantity = Math.max(0, newQuantity);
    const oldQuantity = currentQuantity;
    setCurrentQuantity(clampedQuantity);
    onQuantityChange(id, clampedQuantity);

    if (clampedQuantity > 0 && clampedQuantity > oldQuantity) {
      toast({
        title: "Item updated",
        description: `${name} quantity set to ${clampedQuantity}.`,
      });
    } else if (clampedQuantity > 0 && clampedQuantity < oldQuantity) {
       toast({
        title: "Item updated",
        description: `${name} quantity set to ${clampedQuantity}.`,
      });
    } else if (clampedQuantity === 0 && oldQuantity > 0) {
      toast({
        title: "Item removed",
        description: `${name} has been removed from your cart.`,
      });
    } else if (clampedQuantity === 1 && oldQuantity === 0) {
       toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
    }
  };

  const handleInitialAddToCart = () => {
    handleSetQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    handleSetQuantity(currentQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    handleSetQuantity(currentQuantity - 1);
  };

  return (
    <Card className="w-full max-w-xs flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || 'https://via.placeholder.com/400x225?text=Food+Image'}
            alt={name}
            className="object-cover w-full h-full rounded-t-lg"
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="p-4 flex-grow space-y-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-3 h-[3.75rem]"> {/* approx 3 lines */}
          {description}
        </CardDescription>
        <p className="text-xl font-bold text-green-600">${price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-3 border-t bg-slate-50">
        {currentQuantity === 0 ? (
          <Button onClick={handleInitialAddToCart} className="w-full" aria-label={`Add ${name} to cart`}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-center space-x-2 w-full">
            <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} aria-label={`Decrease quantity of ${name}`}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="text" // Using text type to avoid browser's default number input UI, as it's read-only
              value={currentQuantity}
              readOnly
              className="w-12 h-9 text-center font-semibold text-base border-gray-300 focus-visible:ring-transparent"
              aria-label={`Current quantity of ${name}`}
            />
            <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label={`Increase quantity of ${name}`}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;