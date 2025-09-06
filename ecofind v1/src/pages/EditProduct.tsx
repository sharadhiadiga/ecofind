import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Image, Package } from 'lucide-react';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, products, updateProduct } = useEcoFinds();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      if (product.sellerId !== user?.id) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own products",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image || ''
      });
    } else if (id) {
      toast({
        title: "Product Not Found",
        description: "The product you're trying to edit doesn't exist",
        variant: "destructive",
      });
      navigate('/my-listings');
    }
  }, [product, user, id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
        toast({
          title: "Incomplete Form",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        return;
      }

      updateProduct(id!, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category,
        image: formData.image || '',
      });

      toast({
        title: "Product Updated!",
        description: "Your product has been successfully updated",
      });

      navigate('/my-listings');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/my-listings')} className="bg-eco-primary hover:bg-eco-primary-light">
          Back to My Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="shadow-elevated">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-eco rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">Edit Product</CardTitle>
              <CardDescription>
                Update your product listing on EcoFinds
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a descriptive title for your product"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {categories.slice(1).map((category) => ( // Skip "All" category
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product's condition, features, and any important details..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Add a URL to an image of your product. If left empty, a placeholder will be used.
              </p>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="w-32 h-32 border rounded-lg overflow-hidden bg-eco-secondary">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <Image className="h-8 w-8 text-eco-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-eco-primary hover:bg-eco-primary-light"
                size="lg"
              >
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;