import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { Search, Filter, ShoppingCart, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const {
    categories,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    getFilteredProducts,
    addToCart,
  } = useEcoFinds();

  const products = getFilteredProducts();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero Banner */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-elevated">
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src="https://wallpaperbat.com/img/1510535-green-scenery-wallpaper-4k.jpg"
            alt="Eco-friendly green scenery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl px-8 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Discover Sustainable
                <span className="block text-green-300">Living</span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
                Find eco-friendly products and give them a second life. Join our community of conscious consumers.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-lg font-semibold px-8 py-4"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for eco-friendly products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
          <div className="flex items-center space-x-3 min-w-fit">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-input rounded-xl bg-background text-sm h-14 min-w-[150px] focus:border-eco-primary focus:ring-4 focus:ring-eco-primary/10 transition-all duration-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-gradient-button text-white shadow-button hover:shadow-button-hover'
                  : 'bg-eco-secondary/50 text-eco-primary-dark border-eco-primary/20 hover:bg-eco-secondary hover:border-eco-primary/40'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h2>
        <p className="text-lg text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <Search className="h-16 w-16 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">No products found</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Be the first to list a product!'}
          </p>
          <Button asChild className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover">
            <Link to="/add-product">Add Your First Product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="card-product group">
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-eco-secondary to-eco-secondary/70 flex items-center justify-center">
                  <img
                    src={product.image || '/placeholder-image.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-eco-primary text-5xl font-bold">
                    {product.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button size="sm" variant="secondary" className="bg-white/95 hover:bg-white shadow-lg hover:shadow-xl">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/95 text-eco-primary border-eco-primary/30 text-xs font-medium">
                    {product.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-1 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-eco-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      by {product.sellerName}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10"
                  >
                    <Link to={`/product/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                    className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover h-10 w-10"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;