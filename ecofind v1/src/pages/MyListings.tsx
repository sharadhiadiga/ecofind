import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const MyListings: React.FC = () => {
  const { getUserProducts, deleteProduct } = useEcoFinds();
  const { toast } = useToast();
  
  const userProducts = getUserProducts();

  const handleDelete = (productId: string, productTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: `"${productTitle}" has been removed from your listings`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your products and track your sales
          </p>
        </div>
        <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
          <Link to="/add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      {userProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-eco-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-12 w-12 text-eco-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No listings yet</h2>
          <p className="text-muted-foreground mb-6">
            Start selling on EcoFinds by creating your first product listing
          </p>
          <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
            <Link to="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-primary">
                    {userProducts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Listings
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-success">
                    ${userProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Value
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-accent">
                    ${(userProducts.reduce((sum, p) => sum + p.price, 0) / userProducts.length || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Price
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-elevated transition-all duration-300">
                <div className="relative">
                  <div className="aspect-square bg-eco-secondary flex items-center justify-center">
                    <img
                      src={product.image || '/placeholder-image.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-eco-primary text-4xl font-bold">
                      {product.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-eco-primary">
                        ${product.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link to={`/product/${product.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link to={`/edit-product/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.title)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;