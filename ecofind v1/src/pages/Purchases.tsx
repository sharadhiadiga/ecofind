import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { Package, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';

const Purchases: React.FC = () => {
  const { purchases } = useEcoFinds();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Purchase History</h1>
        <p className="text-muted-foreground">
          View all your past purchases on EcoFinds
        </p>
      </div>

      {/* Empty State */}
      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-eco-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-12 w-12 text-eco-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No purchases yet</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your purchase history here
          </p>
          <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
            <Link to="/">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Purchase Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-primary">
                    {purchases.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Orders
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-success">
                    {purchases.reduce((sum, p) => sum + p.products.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Items Purchased
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-accent">
                    ${purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Spent
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase List */}
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Purchase Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-eco-secondary rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-eco-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Order #{purchase.id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(purchase.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-eco-primary">
                        ${purchase.total.toFixed(2)}
                      </div>
                      <Badge variant="outline" className="text-eco-success border-eco-success">
                        Completed
                      </Badge>
                    </div>
                  </div>

                  {/* Purchase Items */}
                  <div className="space-y-3">
                    {purchase.products.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-eco-surface rounded-lg">
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-eco-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-image.svg'}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-eco-primary text-sm font-bold">
                            {item.title.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground line-clamp-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-eco-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* View Product Button */}
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/product/${item.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Summary */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {purchase.products.length} {purchase.products.length === 1 ? 'item' : 'items'}
                      </span>
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold text-eco-primary">
                          ${purchase.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Message */}
          <Card className="bg-eco-secondary/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-3">
                🌱 Your Sustainable Impact
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                By purchasing {purchases.reduce((sum, p) => sum + p.products.length, 0)} second-hand items, 
                you've helped extend the lifecycle of these products and contributed to a more sustainable future!
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Reduced waste by choosing pre-owned items</li>
                <li>• Supported the circular economy</li>
                <li>• Saved money while making eco-friendly choices</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Purchases;