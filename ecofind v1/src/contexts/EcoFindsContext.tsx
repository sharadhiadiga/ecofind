import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Purchase {
  id: string;
  products: CartItem[];
  total: number;
  date: string;
  buyerId: string;
}

interface EcoFindsContextType {
  products: Product[];
  cart: CartItem[];
  purchases: Purchase[];
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  completePurchase: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  getUserProducts: () => Product[];
  getFilteredProducts: () => Product[];
}

const EcoFindsContext = createContext<EcoFindsContextType | undefined>(undefined);

const CATEGORIES = [
  'Electronics',
  'Furniture', 
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys & Games',
  'Automotive',
  'Others'
];

export const EcoFindsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Initialize sample data first
    const existingProducts = localStorage.getItem('ecofinds_products');
    if (!existingProducts) {
      // Import and initialize sample data
      import('../data/sampleProducts').then(({ initializeSampleData }) => {
        initializeSampleData();
        const sampleProducts = JSON.parse(localStorage.getItem('ecofinds_products') || '[]');
        setProducts(sampleProducts);
      });
    } else {
      setProducts(JSON.parse(existingProducts));
    }

    const savedCart = localStorage.getItem('ecofinds_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedPurchases = localStorage.getItem('ecofinds_purchases');
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecofinds_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ecofinds_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ecofinds_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => {
    if (!user) return;

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      sellerId: user.id,
      sellerName: user.username || user.email,
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const completePurchase = () => {
    if (!user || cart.length === 0) return;

    const purchase: Purchase = {
      id: Date.now().toString(),
      products: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      buyerId: user.id,
    };

    setPurchases(prev => [purchase, ...prev]);
    clearCart();
  };

  const getUserProducts = (): Product[] => {
    if (!user) return [];
    return products.filter(product => product.sellerId === user.id);
  };

  const getFilteredProducts = (): Product[] => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <EcoFindsContext.Provider value={{
      products,
      cart,
      purchases: purchases.filter(p => p.buyerId === user?.id),
      categories: ['All', ...CATEGORIES],
      searchTerm,
      selectedCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      clearCart,
      completePurchase,
      setSearchTerm,
      setSelectedCategory,
      getUserProducts,
      getFilteredProducts,
    }}>
      {children}
    </EcoFindsContext.Provider>
  );
};

export const useEcoFinds = () => {
  const context = useContext(EcoFindsContext);
  if (context === undefined) {
    throw new Error('useEcoFinds must be used within an EcoFindsProvider');
  }
  return context;
};