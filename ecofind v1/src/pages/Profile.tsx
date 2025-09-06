import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <Card className="shadow-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">
                  {user.name || user.username}
                </CardTitle>
                <CardDescription>
                  Manage your EcoFinds profile
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "ghost" : "outline"}
              size="sm"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email</span>
            </Label>
            <Input
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Username</span>
            </Label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your username"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Full Name</span>
            </Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Phone Number</span>
            </Label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Address</span>
            </Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your address"
            />
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-eco-primary hover:bg-eco-primary-light"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Account Stats */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-eco-primary">
                      {/* This would be calculated from actual data */}
                      0
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Products Sold
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-eco-success">
                      {/* This would be calculated from actual data */}
                      0
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Items Purchased
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* EcoFinds Impact */}
          <div className="bg-eco-secondary/30 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground text-sm mb-2">
              Your EcoFinds Impact
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Contributing to a sustainable marketplace</li>
              <li>• Helping reduce waste through reuse</li>
              <li>• Supporting circular economy principles</li>
              <li>• Creating value from second-hand goods</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;