import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, clearAllData, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one special character (@$!%*?&)" };
    }
    return { isValid: true, message: "" };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Registration specific validations
    if (!isLogin) {
      // Display name validation
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Display name is required";
      } else if (formData.displayName.trim().length < 2) {
        newErrors.displayName = "Display name must be at least 2 characters long";
      }

      // Confirm password validation
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        }
      } else {
        success = await register(formData.email, formData.password, formData.displayName);
        if (!success) {
          toast({
            title: "Registration Failed",
            description: "An account with this email already exists. Please try logging in instead or use a different email address.",
            variant: "destructive",
          });
        }
      }

      if (success) {
        if (isLogin) {
          toast({
            title: "Welcome back!",
            description: "You have been logged in successfully",
          });
          navigate('/');
        } else {
          toast({
            title: "Account created successfully!",
            description: "Welcome to EcoFinds! Please check your email and click the verification link to complete your registration.",
          });
          // Don't navigate immediately for registration - let user see the verification message
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardHeader className="space-y-8 pb-8">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center shadow-button">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold text-eco-primary mb-3">
              {isLogin ? 'Welcome Back' : 'Join EcoFinds'}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {isLogin 
                ? 'Sign in to your sustainable marketplace' 
                : 'Start your eco-friendly journey today'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="form-group">
                <Label htmlFor="displayName" className="form-label flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`h-12 ${errors.displayName ? 'border-destructive focus:border-destructive' : ''}`}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive mt-1">{errors.displayName}</p>
                )}
              </div>
            )}
            
            <div className="form-group">
              <Label htmlFor="email" className="form-label flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`h-12 ${errors.email ? 'border-destructive focus:border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="form-group">
              <Label htmlFor="password" className="form-label flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-12 pr-12 ${errors.password ? 'border-destructive focus:border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
              {!isLogin && formData.password && !errors.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-eco-success' : 'text-muted-foreground'}`}>
                      <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-eco-success' : 'bg-muted-foreground'}`} />
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*[a-z])/.test(formData.password) ? 'text-eco-success' : 'text-muted-foreground'}`}>
                      <div className={`w-1 h-1 rounded-full ${/(?=.*[a-z])/.test(formData.password) ? 'bg-eco-success' : 'bg-muted-foreground'}`} />
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-eco-success' : 'text-muted-foreground'}`}>
                      <div className={`w-1 h-1 rounded-full ${/(?=.*[A-Z])/.test(formData.password) ? 'bg-eco-success' : 'bg-muted-foreground'}`} />
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*\d)/.test(formData.password) ? 'text-eco-success' : 'text-muted-foreground'}`}>
                      <div className={`w-1 h-1 rounded-full ${/(?=.*\d)/.test(formData.password) ? 'bg-eco-success' : 'bg-muted-foreground'}`} />
                      Number
                    </div>
                    <div className={`flex items-center gap-1 ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-eco-success' : 'text-muted-foreground'}`}>
                      <div className={`w-1 h-1 rounded-full ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'bg-eco-success' : 'bg-muted-foreground'}`} />
                      Special char
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <Label htmlFor="confirmPassword" className="form-label flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`h-12 pr-12 ${errors.confirmPassword ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-base text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <Button
                variant="link"
                className="pl-2 text-eco-primary hover:text-eco-primary-light text-base font-medium"
                onClick={toggleAuthMode}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
            
            {/* Email verification info */}
            {!isLogin && (
              <div className="pt-4 border-t border-border/50">
                <div className="bg-eco-info/10 border border-eco-info/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-eco-info mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-eco-info">Email Verification Required</p>
                      <p className="text-muted-foreground mt-1">
                        We'll send a verification link to your email address. You must verify your email to use all features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debug button - remove in production */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearAllData();
                  toast({
                    title: "Debug",
                    description: "All user data cleared. You can now test registration.",
                  });
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All Data (Debug)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;