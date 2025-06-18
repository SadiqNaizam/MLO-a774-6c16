import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import RestaurantCard from '@/components/RestaurantCard';
import CuisineFilterTag from '@/components/CuisineFilterTag';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card'; // For structure if needed

// Lucide Icons
import { Search, ShoppingCart, UserCircle, MapPin, Filter } from 'lucide-react';

interface RestaurantCardData {
  id: string | number;
  slug: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  promotions?: string[];
}

const ALL_RESTAURANTS: RestaurantCardData[] = [
  { id: 1, slug: "bella-italia", imageUrl: "https://placehold.co/600x400/E91E63/white?text=Bella+Italia&font=lora", name: "Bella Italia", cuisineTypes: ["Italian", "Pizza"], rating: 4.5, deliveryTime: "30-40 min", promotions: ["20% Off Pasta"] },
  { id: 2, slug: "taco-fiesta", imageUrl: "https://placehold.co/600x400/FF9800/white?text=Taco+Fiesta&font=lora", name: "Taco Fiesta", cuisineTypes: ["Mexican"], rating: 4.2, deliveryTime: "25-35 min", promotions: ["Free Guac"] },
  { id: 3, slug: "dragon-wok", imageUrl: "https://placehold.co/600x400/F44336/white?text=Dragon+Wok&font=lora", name: "Dragon Wok", cuisineTypes: ["Chinese", "Asian"], rating: 4.0, deliveryTime: "35-45 min" },
  { id: 4, slug: "curry-house", imageUrl: "https://placehold.co/600x400/4CAF50/white?text=Curry+House&font=lora", name: "Curry House", cuisineTypes: ["Indian"], rating: 4.7, deliveryTime: "40-50 min", promotions: ["Free Naan"] },
  { id: 5, slug: "sushi-central", imageUrl: "https://placehold.co/600x400/2196F3/white?text=Sushi+Central&font=lora", name: "Sushi Central", cuisineTypes: ["Japanese", "Sushi"], rating: 4.8, deliveryTime: "30-40 min" },
  { id: 6, slug: "burger-joint", imageUrl: "https://placehold.co/600x400/795548/white?text=Burger+Joint&font=lora", name: "Burger Joint", cuisineTypes: ["Burgers", "Fast Food"], rating: 4.1, deliveryTime: "20-30 min", promotions: ["Combo Deal"] },
  { id: 7, slug: "veggie-delight", imageUrl: "https://placehold.co/600x400/8BC34A/white?text=Veggie+Delight&font=lora", name: "Veggie Delight", cuisineTypes: ["Vegetarian", "Healthy"], rating: 4.6, deliveryTime: "25-35 min" },
  { id: 8, slug: "pizza-heaven", imageUrl: "https://placehold.co/600x400/CDDC39/black?text=Pizza+Heaven&font=lora", name: "Pizza Heaven", cuisineTypes: ["Pizza", "Italian"], rating: 4.3, deliveryTime: "30-40 min", promotions: ["Buy 1 Get 1 Free"] },
  { id: 9, slug: "thai-orchid", imageUrl: "https://placehold.co/600x400/9C27B0/white?text=Thai+Orchid&font=lora", name: "Thai Orchid", cuisineTypes: ["Thai", "Asian"], rating: 4.4, deliveryTime: "35-45 min" },
  { id: 10, slug: "cafe-bistro", imageUrl: "https://placehold.co/600x400/607D8B/white?text=Cafe+Bistro&font=lora", name: "Cafe Bistro", cuisineTypes: ["Cafe", "Sandwiches"], rating: 4.0, deliveryTime: "20-30 min" },
];

const CUISINE_OPTIONS = ["Italian", "Mexican", "Chinese", "Indian", "Japanese", "Thai", "Fast Food", "Vegetarian", "Pizza", "Asian", "Burgers", "Healthy", "Cafe", "Sushi"];

const ITEMS_PER_PAGE = 8;

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCuisines, setActiveCuisines] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  console.log('Homepage loaded');

  const handleCuisineFilterClick = (cuisine: string) => {
    setActiveCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredRestaurants = useMemo(() => {
    return ALL_RESTAURANTS.filter(restaurant => {
      const matchesSearchTerm =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineTypes.some(cuisine =>
          cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCuisineFilter =
        activeCuisines.length === 0 ||
        activeCuisines.every(ac => restaurant.cuisineTypes.includes(ac));
      
      return matchesSearchTerm && matchesCuisineFilter;
    });
  }, [searchTerm, activeCuisines]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll towards top of restaurant list
    }
  };
  
  useEffect(() => {
    // Reset to page 1 if filters result in fewer pages than current
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    } else if (totalPages === 0 && filteredRestaurants.length > 0) { // handles case where totalPages becomes 0 but there should be 1 page
        setCurrentPage(1);
    } else if (filteredRestaurants.length === 0) {
        setCurrentPage(1); // no results, still page 1
    }
  }, [currentPage, totalPages, filteredRestaurants.length]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* AppHeader Placeholder */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
            Yum Express
          </Link>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600">
              <MapPin className="mr-1 h-4 w-4" /> New York
            </Button>
            <Link to="/cart" aria-label="View Cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-600" />
              </Button>
            </Link>
            <Link to="/user-profile" aria-label="User Profile">
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6 text-gray-600 hover:text-orange-600" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl mb-3">
            Order food to your door
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find your favorite restaurants and cuisines, delivered quickly and reliably.
          </p>
          <div className="max-w-xl mx-auto flex items-center gap-2 p-1 bg-white rounded-full shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500">
            <Search className="h-5 w-5 ml-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search restaurants, cuisines..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-grow !border-0 !ring-0 !shadow-none !outline-none p-3 text-base"
            />
            <Button type="button" size="sm" className="mr-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setCurrentPage(1)}>
              Search
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-orange-500"/> Filter by Cuisine
            </h2>
            {activeCuisines.length > 0 && (
                 <Button variant="link" size="sm" onClick={() => {setActiveCuisines([]); setCurrentPage(1);}} className="text-orange-600 hover:text-orange-700">
                    Clear Filters
                </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {CUISINE_OPTIONS.map(cuisine => (
              <CuisineFilterTag
                key={cuisine}
                label={cuisine}
                isActive={activeCuisines.includes(cuisine)}
                onClick={handleCuisineFilterClick}
              />
            ))}
          </div>
        </section>
        
        <ScrollArea className="w-full" style={{ height: paginatedRestaurants.length > 0 ? 'auto' : '100px' }}> {/* Adjust height or remove if not needed */}
          {paginatedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          ) : (
            <Card className="col-span-full text-center p-10 border-dashed">
              <h3 className="text-xl font-medium text-gray-700">No Restaurants Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </Card>
          )}
        </ScrollArea>

        {totalPages > 1 && (
          <section className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Basic pagination display logic (can be enhanced for many pages)
                    if (totalPages <= 5 || (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) ) {
                         return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                isActive={currentPage === page}
                                >
                                {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    } else if (Math.abs(page - currentPage) === 2 && totalPages > 5) {
                        return <PaginationEllipsis key={`ellipsis-${page}`} />;
                    }
                    return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </main>

      {/* AppFooter Placeholder */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Yum Express. Your favorite food, delivered.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;