import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { Leaf, Search, ShoppingCart, User, Package, LogOut, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useEcoFinds();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-button">
                <img
                  src="https://wallpaperbat.com/img/1510535-green-scenery-wallpaper-4k.jpg"
                  alt="EcoFinds Logo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-eco/80 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-eco-primary tracking-tight">EcoFinds</span>
            </Link>

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-all duration-300 hover:text-eco-primary hover:scale-105 px-3 py-2 rounded-lg ${
                    location.pathname === '/' 
                      ? 'text-eco-primary bg-eco-secondary/50' 
                      : 'text-muted-foreground hover:bg-eco-secondary/30'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  to="/my-listings"
                  className={`text-sm font-medium transition-all duration-300 hover:text-eco-primary hover:scale-105 px-3 py-2 rounded-lg ${
                    location.pathname === '/my-listings' 
                      ? 'text-eco-primary bg-eco-secondary/50' 
                      : 'text-muted-foreground hover:bg-eco-secondary/30'
                  }`}
                >
                  My Listings
                </Link>
                <Link
                  to="/purchases"
                  className={`text-sm font-medium transition-all duration-300 hover:text-eco-primary hover:scale-105 px-3 py-2 rounded-lg ${
                    location.pathname === '/purchases' 
                      ? 'text-eco-primary bg-eco-secondary/50' 
                      : 'text-muted-foreground hover:bg-eco-secondary/30'
                  }`}
                >
                  Purchases
                </Link>
              </nav>
            )}

            {/* Right side actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover"
                >
                  <Link to="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="sm" className="relative">
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-eco-success text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg animate-bounce-gentle">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-gradient-button hover:bg-gradient-button-hover text-white shadow-button hover:shadow-button-hover">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-elevated z-40">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/"
              className={`flex flex-col items-center py-2 px-4 text-xs rounded-xl transition-all duration-300 hover:scale-105 ${
                location.pathname === '/' 
                  ? 'text-eco-primary bg-eco-secondary/50' 
                  : 'text-muted-foreground hover:bg-eco-secondary/30'
              }`}
            >
              <Search className="h-5 w-5 mb-1" />
              Browse
            </Link>
            <Link
              to="/my-listings"
              className={`flex flex-col items-center py-2 px-4 text-xs rounded-xl transition-all duration-300 hover:scale-105 ${
                location.pathname === '/my-listings' 
                  ? 'text-eco-primary bg-eco-secondary/50' 
                  : 'text-muted-foreground hover:bg-eco-secondary/30'
              }`}
            >
              <Package className="h-5 w-5 mb-1" />
              Listings
            </Link>
            <Link
              to="/add-product"
              className="flex flex-col items-center py-2 px-4 text-xs text-eco-primary hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gradient-button text-white rounded-full p-2 mb-1 shadow-button">
                <Plus className="h-4 w-4" />
              </div>
              Add
            </Link>
            <Link
              to="/cart"
              className={`flex flex-col items-center py-2 px-4 text-xs relative rounded-xl transition-all duration-300 hover:scale-105 ${
                location.pathname === '/cart' 
                  ? 'text-eco-primary bg-eco-secondary/50' 
                  : 'text-muted-foreground hover:bg-eco-secondary/30'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mb-1" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-2 bg-eco-success text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-lg animate-bounce-gentle">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center py-2 px-4 text-xs rounded-xl transition-all duration-300 hover:scale-105 ${
                location.pathname === '/profile' 
                  ? 'text-eco-primary bg-eco-secondary/50' 
                  : 'text-muted-foreground hover:bg-eco-secondary/30'
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;