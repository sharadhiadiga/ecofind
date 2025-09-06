import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Image, Package, Upload, X, Camera } from 'lucide-react';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addProduct } = useEcoFinds();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: categories[1] || '', // Skip "All" category
    image: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, GIF, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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

      addProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category,
        image: imagePreview || formData.image || '', // Use uploaded image or URL
      });

      toast({
        title: "Product Listed!",
        description: "Your product has been successfully listed",
      });

      navigate('/my-listings');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-8 -ml-2 hover:bg-eco-secondary/50 hover:text-eco-primary"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="shadow-elevated animate-fade-in">
        <CardHeader className="pb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-eco rounded-xl flex items-center justify-center shadow-button">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl text-foreground font-bold">Add New Product</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                List your item on EcoFinds and help build a sustainable marketplace
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Title */}
            <div className="form-group">
              <Label htmlFor="title" className="form-label">Product Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a descriptive title for your product"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="h-12"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <Label htmlFor="category" className="form-label">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-eco-primary/10 focus-visible:border-eco-primary transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:border-eco-primary/50"
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
            <div className="form-group">
              <Label htmlFor="price" className="form-label">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">
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
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <Label htmlFor="description" className="form-label">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product's condition, features, and any important details..."
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="rounded-xl border-2 border-input focus:border-eco-primary focus:ring-4 focus:ring-eco-primary/10 transition-all duration-300 hover:border-eco-primary/50"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <Label className="form-label">Product Image</Label>
              
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-eco-primary/50 ${
                  imagePreview 
                    ? 'border-eco-primary bg-eco-primary/5' 
                    : 'border-border hover:bg-eco-secondary/10'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto border-2 border-border rounded-xl overflow-hidden bg-gradient-to-br from-eco-secondary to-eco-secondary/70 shadow-card">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile?.size && (selectedFile.size / 1024 / 1024).toFixed(2))} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-eco rounded-2xl flex items-center justify-center shadow-button">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
            <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Upload Product Image
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop an image here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternative URL Input */}
              <div className="mt-4">
                <Label htmlFor="image" className="form-label text-sm">Or add image URL (Optional)</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleInputChange}
                  className="h-10"
                  disabled={!!imagePreview}
              />
                {imagePreview && (
                  <p className="text-xs text-muted-foreground mt-1">
                    URL input disabled when file is uploaded
              </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-lg font-semibold"
                size="lg"
              >
                {isLoading ? 'Creating Listing...' : 'List Product'}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-eco-secondary/30 to-eco-secondary/10 p-6 rounded-2xl border border-eco-primary/20">
              <h4 className="font-semibold text-foreground mb-3 text-lg">💡 Listing Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="text-eco-primary mr-2">•</span>
                  Be honest about the condition of your item
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-2">•</span>
                  Use clear, descriptive titles
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-2">•</span>
                  Include relevant details in the description
                </li>
                <li className="flex items-start">
                  <span className="text-eco-primary mr-2">•</span>
                  Price competitively for quick sales
                </li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;