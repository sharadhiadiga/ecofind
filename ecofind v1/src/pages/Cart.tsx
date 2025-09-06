import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, completePurchase, addToCart } = useEcoFinds();
  const { toast } = useToast();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id);
    } else if (newQuantity > item.quantity) {
      addToCart(item);
    } else {
      // For simplicity, we'll just remove one by removing and re-adding
      removeFromCart(item.id);
      if (newQuantity > 1) {
        for (let i = 0; i < newQuantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  const handleCompletePurchase = () => {
    completePurchase();
    toast({
      title: "Purchase Completed!",
      description: "Your items have been purchased successfully",
    });
    navigate('/purchases');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Shopping Cart</h1>
          <p className="text-lg text-muted-foreground">
            {cart.length === 0 
              ? 'Your cart is empty' 
              : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`
            }
          </p>
        </div>
        {cart.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 hover:border-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <ShoppingCart className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Your cart is empty</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Discover amazing second-hand products on EcoFinds
          </p>
          <Button asChild className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover">
            <Link to="/">
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <Card key={item.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-eco-secondary to-eco-secondary/70 rounded-xl flex items-center justify-center flex-shrink-0 shadow-card">
                      <img
                        src={item.image || '/placeholder-image.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden text-eco-primary text-2xl font-bold">
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="outline" className="text-xs mb-2 bg-eco-secondary/50 text-eco-primary border-eco-primary/30">
                            {item.category}
                          </Badge>
                          <h3 className="font-semibold text-foreground text-lg line-clamp-1 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {item.sellerName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10 hover:scale-110 transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="h-9 w-9 p-0 rounded-lg hover:scale-110 transition-all duration-300"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center text-base font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="h-9 w-9 p-0 rounded-lg hover:scale-110 transition-all duration-300"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-eco-primary text-xl">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-elevated">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">
                      Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-eco-success">Free</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground text-lg">Total</span>
                      <span className="font-bold text-2xl text-eco-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCompletePurchase}
                  className="w-full h-14 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-lg font-semibold mb-4"
                  size="lg"
                >
                  Complete Purchase
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button asChild variant="outline" className="w-full h-12 text-base font-medium">
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>

                <div className="mt-8 p-6 bg-gradient-to-br from-eco-secondary/30 to-eco-secondary/10 rounded-2xl border border-eco-primary/20">
                  <h4 className="font-semibold text-foreground text-base mb-3">
                    🌱 EcoFinds Promise
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="text-eco-primary mr-2">•</span>
                      Sustainable marketplace
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco-primary mr-2">•</span>
                      Quality second-hand goods
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco-primary mr-2">•</span>
                      Support circular economy
                    </li>
                    <li className="flex items-start">
                      <span className="text-eco-primary mr-2">•</span>
                      Free shipping on all orders
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;