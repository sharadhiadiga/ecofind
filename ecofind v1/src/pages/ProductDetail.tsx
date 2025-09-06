import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ShoppingCart, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart } = useEcoFinds();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-32 h-32 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevated">
          <ShoppingCart className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover">
          Back to Browse
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (user?.id === product.sellerId) {
      toast({
        title: "Cannot add own product",
        description: "You cannot add your own product to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart`,
    });
  };

  const isOwner = user?.id === product.sellerId;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-8 -ml-2 hover:bg-eco-secondary/50 hover:text-eco-primary"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        {/* Product Image */}
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-elevated hover:shadow-soft transition-all duration-300">
            <div className="aspect-square bg-gradient-to-br from-eco-secondary to-eco-secondary/70 flex items-center justify-center">
              <img
                src={product.image || '/placeholder-image.svg'}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-eco-primary text-8xl font-bold">
                {product.title.charAt(0).toUpperCase()}
              </div>
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <Badge variant="outline" className="mb-4 bg-eco-secondary/50 text-eco-primary border-eco-primary/30 text-sm font-medium px-3 py-1">
              {product.category}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              {product.title}
            </h1>
            <div className="text-4xl font-bold text-eco-primary mb-6">
              ${product.price}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-eco rounded-full flex items-center justify-center shadow-button">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      {product.sellerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Verified Seller
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center text-sm text-muted-foreground bg-eco-secondary/30 px-4 py-3 rounded-xl">
              <Calendar className="h-5 w-5 mr-3 text-eco-primary" />
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            {isOwner ? (
              <div className="space-y-4">
                <Button
                  asChild
                  className="w-full h-14 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-lg font-semibold"
                >
                  <Link to={`/edit-product/${product.id}`}>
                    Edit Listing
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground text-center bg-eco-secondary/30 px-4 py-2 rounded-xl">
                  This is your listing
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-lg font-semibold"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Link to="/cart">
                    View Cart
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Product Stats */}
          <Card className="bg-gradient-to-br from-eco-secondary/30 to-eco-secondary/10 border border-eco-primary/20 shadow-card">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">🌱 Why Choose EcoFinds?</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-eco-primary mr-3">•</span>
                  Sustainable second-hand marketplace
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-3">•</span>
                  Verified sellers and quality products
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-3">•</span>
                  Reduce waste, save money
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-3">•</span>
                  Support circular economy
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;