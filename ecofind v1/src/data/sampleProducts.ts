export const sampleProducts = [
  {
    id: '1',
    title: 'Vintage Leather Armchair',
    description: 'Beautiful vintage brown leather armchair in excellent condition. Perfect for any living room or study. Shows minimal wear and has been well maintained.',
    price: 299.99,
    category: 'Furniture',
    image: '',
    sellerId: 'sample1',
    sellerName: 'Sarah M.',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro 128GB',
    description: 'Unlocked iPhone 12 Pro in Space Gray. 128GB storage, battery health at 87%. Includes original box and charger. No scratches on screen.',
    price: 549.00,
    category: 'Electronics',
    image: '',
    sellerId: 'sample2',
    sellerName: 'Mike Chen',
    createdAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Designer Winter Coat',
    description: 'Authentic Marc Jacobs winter coat, size M. Worn only a few times. Perfect for cold weather. Navy blue color with fur-lined hood.',
    price: 180.00,
    category: 'Clothing',
    image: '',
    sellerId: 'sample3',
    sellerName: 'Emma K.',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Complete Harry Potter Book Set',
    description: 'Full collection of Harry Potter books 1-7 in hardcover. All in great condition with dust jackets. Perfect for collectors or new readers.',
    price: 75.00,
    category: 'Books',
    image: '',
    sellerId: 'sample4',
    sellerName: 'BookLover99',
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Road Bike - Trek FX 2',
    description: 'Trek FX 2 hybrid bike in excellent condition. Size L frame, 21-speed, perfect for commuting or recreational riding. Recently serviced.',
    price: 320.00,
    category: 'Sports',
    image: '',
    sellerId: 'sample5',
    sellerName: 'CycleGuru',
    createdAt: '2024-01-11T11:20:00Z'
  },
  {
    id: '6',
    title: 'Organic Herb Garden Kit',
    description: 'Complete indoor herb garden kit with planters, organic soil, and seeds for basil, mint, cilantro, and parsley. Great for apartment living.',
    price: 45.00,
    category: 'Home & Garden',
    image: '',
    sellerId: 'sample6',
    sellerName: 'GreenThumb',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '7',
    title: 'Nintendo Switch Console',
    description: 'Nintendo Switch console with Joy-Con controllers. Includes dock, all cables, and 3 games: Mario Kart, Zelda, and Super Mario Odyssey.',
    price: 275.00,
    category: 'Toys & Games',
    image: '',
    sellerId: 'sample7',
    sellerName: 'GamerDad',
    createdAt: '2024-01-09T19:30:00Z'
  },
  {
    id: '8',
    title: '2015 Toyota Camry Wheels',
    description: 'Set of 4 alloy wheels from 2015 Toyota Camry. Size 16 inch, in good condition with minimal curb rash. Perfect as replacement or upgrade.',
    price: 400.00,
    category: 'Automotive',
    image: '',
    sellerId: 'sample8',
    sellerName: 'AutoParts',
    createdAt: '2024-01-08T13:15:00Z'
  }
];

// Initialize sample data in localStorage if it doesn't exist
export const initializeSampleData = () => {
  const existingProducts = localStorage.getItem('ecofinds_products');
  if (!existingProducts) {
    localStorage.setItem('ecofinds_products', JSON.stringify(sampleProducts));
  }
  
  // Create sample users for the sellers
  const existingUsers = localStorage.getItem('ecofinds_users');
  if (!existingUsers) {
    const sampleUsers = [
      { id: 'sample1', email: 'sarah@example.com', password: 'password', username: 'Sarah M.', name: 'Sarah Mitchell', phone: '', address: '' },
      { id: 'sample2', email: 'mike@example.com', password: 'password', username: 'Mike Chen', name: 'Mike Chen', phone: '', address: '' },
      { id: 'sample3', email: 'emma@example.com', password: 'password', username: 'Emma K.', name: 'Emma Klein', phone: '', address: '' },
      { id: 'sample4', email: 'booklover@example.com', password: 'password', username: 'BookLover99', name: 'Alex Thompson', phone: '', address: '' },
      { id: 'sample5', email: 'cycle@example.com', password: 'password', username: 'CycleGuru', name: 'David Rodriguez', phone: '', address: '' },
      { id: 'sample6', email: 'green@example.com', password: 'password', username: 'GreenThumb', name: 'Lisa Green', phone: '', address: '' },
      { id: 'sample7', email: 'gamer@example.com', password: 'password', username: 'GamerDad', name: 'Tom Wilson', phone: '', address: '' },
      { id: 'sample8', email: 'auto@example.com', password: 'password', username: 'AutoParts', name: 'Jim\'s Auto Parts', phone: '', address: '' },
    ];
    localStorage.setItem('ecofinds_users', JSON.stringify(sampleUsers));
  }
};