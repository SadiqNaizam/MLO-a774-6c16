import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, Tag } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  slug: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  promotions?: string[];
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  slug,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  deliveryTime,
  promotions,
}) => {
  console.log('RestaurantCard loaded for:', name, 'id:', id);

  return (
    <Link 
      to={`/restaurant-menu?slug=${slug}`} 
      className="block rounded-lg overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`View details for ${name}`}
    >
      <Card className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-xl focus-within:shadow-xl">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>

        <CardContent className="p-4 space-y-2 flex-grow">
          <h3 className="text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-primary">
            {name}
          </h3>
          
          {cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cuisineTypes.slice(0, 3).map((cuisine) => ( // Show max 3 cuisine types for brevity
                <Badge key={cuisine} variant="outline" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>
        </CardContent>

        {promotions && promotions.length > 0 && (
          <CardFooter className="p-4 pt-0 border-t-0"> {/* Changed border-t-0 if promotions feel part of content */}
            <div className="flex flex-wrap gap-2">
              {promotions.slice(0, 2).map((promo) => ( // Show max 2 promotions
                <Badge key={promo} variant="secondary" className="text-xs items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {promo}
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default RestaurantCard;