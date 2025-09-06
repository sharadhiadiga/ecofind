import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { EcoFindsProvider } from "./contexts/EcoFindsContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import MyListings from "./pages/MyListings";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EcoFindsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/edit-product/:id" element={<EditProduct />} />
                        <Route path="/my-listings" element={<MyListings />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/purchases" element={<Purchases />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </EcoFindsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
