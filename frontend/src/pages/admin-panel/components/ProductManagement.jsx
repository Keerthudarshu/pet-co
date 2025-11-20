import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import dataService from '../../../services/dataService';
import productApi from '../../../services/productApi';
import apiClient from '../../../services/api';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import EnhancedProductForm from './EnhancedProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'offline', 'checking'

  // Check backend connectivity
  const checkBackendHealth = async () => {
    try {
      await apiClient.get('/categories');
      setBackendStatus('online');
      return true;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setBackendStatus('offline');
      return false;
    }
  };

  // Helper: resolve image URL coming from backend (relative like "/admin/products/images/xxx.jpg")
  const resolveImageUrl = (p) => {
    let candidate = p?.imageUrl || p?.image || p?.image_path || p?.thumbnailUrl;
    if (!candidate) return '/assets/images/no_image.png';
    if (typeof candidate !== 'string') return '/assets/images/no_image.png';
    
    // Absolute URLs or data URIs - return as is
    if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:')) {
      return candidate;
    }

    // If it's an absolute OS path (Windows or Unix), extract filename
    if (/^[a-zA-Z]:\\/.test(candidate) || candidate.startsWith('\\\\') || candidate.startsWith('/') || candidate.includes('\\')) {
      const parts = candidate.split(/\\|\//);
      candidate = parts[parts.length - 1];
    }

    // If it's a bare filename (e.g., "photo.jpg"), map to API image route
    if (/^[^/]+\.[a-zA-Z0-9]+$/.test(candidate)) {
      candidate = `/admin/products/images/${candidate}`;
    }

    const base = apiClient?.defaults?.baseURL || 'https://nishmitha-roots-7.onrender.com/api';
    const fullUrl = candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
    
    // Log for debugging
    console.log('Resolving image URL:', { original: p?.imageUrl, resolved: fullUrl });
    
    return fullUrl;
  };

  // Handle image load errors
  const handleImageError = (e, productName) => {
    console.warn(`Image failed to load for product: ${productName}`, e.target.src);
    e.target.src = '/assets/images/no_image.png';
  };

  useEffect(() => {
    const initializeData = async () => {
      await checkBackendHealth();
      await loadProducts();
    };
    initializeData();
  }, []);

  const loadProducts = async (retryCount = 0) => {
    try {
      setLoading(true);
      // Load products from backend API
      let apiProducts = [];
      try {
        console.log('Admin Panel: Fetching products from backend API...');
        const response = await productApi.getAll();
        // Spring Boot API returns array directly (not response.data)
        apiProducts = Array.isArray(response) ? response : [];
        console.log('Admin Panel: Successfully loaded products from API:', apiProducts.length);
      } catch (apiError) {
        console.warn('Admin Panel: Backend API failed:', apiError?.message);
        
        // Retry once if it's a network error and this is the first attempt
        if (retryCount < 1 && (apiError?.message?.includes('Network Error') || apiError?.code === 'ERR_NETWORK')) {
          console.log('Admin Panel: Retrying API call...');
          setTimeout(() => loadProducts(retryCount + 1), 2000);
          return;
        }
        
        // Fallback to hardcoded data from dataService
        const fallbackResponse = await dataService.getProducts();
        apiProducts = fallbackResponse?.data || [];
        console.log('Admin Panel: Loaded products from fallback data:', apiProducts.length);
        
        // If no fallback products, create some sample products for demonstration
        if (apiProducts.length === 0) {
          apiProducts = [
            {
              id: 'demo-1',
              name: 'Royal Canin Adult Dog Food - Chicken & Rice',
              shortDescription: 'Complete nutrition for adult dogs with high-quality chicken and rice formula.',
              description: 'Royal Canin Adult Dog Food provides complete and balanced nutrition for adult dogs. Made with high-quality chicken as the first ingredient and easily digestible rice. Key Features: High-quality protein, Enhanced digestive health, Immune system support, Optimal weight management.',
              brand: 'Royal Canin',
              category: { id: 'dog-food', name: 'Dog Food' },
              subcategory: 'Dry Food',
              productType: 'Dry Food',
              lifeStage: 'Adult',
              breedSize: 'All Breeds',
              proteinSource: 'Chicken',
              specialDiet: 'Natural',
              price: 899.99,
              originalPrice: 999.99,
              stockQuantity: 25,
              inStock: true,
              weight: '1kg',
              imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop&crop=center',
              badges: ['Best Seller', 'Natural'],
              features: [
                'High-quality chicken protein',
                'Enhanced digestive health',
                'Immune system support',
                'Optimal weight management'
              ],
              ingredients: 'Chicken, Rice, Corn, Chicken Fat, Wheat, Beet Pulp',
              benefits: 'Complete nutrition, Digestive health, Strong immunity, Healthy weight',
              nutrition: {
                protein: '25%',
                fat: '12%',
                fiber: '4%',
                moisture: '10%'
              },
              variants: [
                { id: 'v1', weight: '500g', price: 499.99, originalPrice: 549.99, stock: 15 },
                { id: 'v2', weight: '1kg', price: 899.99, originalPrice: 999.99, stock: 25 },
                { id: 'v3', weight: '3kg', price: 2199.99, originalPrice: 2399.99, stock: 10 }
              ],
              rating: 4.5,
              reviewCount: 128,
              tags: ['dog', 'food', 'adult', 'chicken', 'royal-canin'],
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: 'demo-2',
              name: 'Whiskas Cat Food - Ocean Fish Flavor',
              shortDescription: 'Delicious ocean fish flavored wet food for cats with complete nutrition.',
              description: 'Whiskas Ocean Fish provides complete and balanced nutrition for cats. Made with real fish for a taste cats love. Key Features: Real ocean fish, Complete nutrition, High moisture content, Supports urinary health.',
              brand: 'Whiskas',
              category: { id: 'cat-food', name: 'Cat Food' },
              subcategory: 'Wet Food',
              productType: 'Wet Food',
              lifeStage: 'Adult',
              proteinSource: 'Fish',
              specialDiet: 'Natural',
              price: 89.99,
              originalPrice: 99.99,
              stockQuantity: 50,
              inStock: true,
              weight: '85g',
              imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop&crop=center',
              badges: ['Popular', 'High Protein'],
              features: [
                'Real ocean fish',
                'Complete nutrition',
                'High moisture content',
                'Supports urinary health'
              ],
              ingredients: 'Fish, Water, Carrots, Rice, Vitamins, Minerals',
              benefits: 'Complete nutrition, Hydration, Urinary health, Great taste',
              nutrition: {
                protein: '8%',
                fat: '4%',
                fiber: '1%',
                moisture: '82%'
              },
              variants: [
                { id: 'v1', weight: '85g', price: 89.99, originalPrice: 99.99, stock: 50 },
                { id: 'v2', weight: 'Pack of 12', price: 999.99, originalPrice: 1099.99, stock: 20 }
              ],
              rating: 4.2,
              reviewCount: 95,
              tags: ['cat', 'food', 'fish', 'wet', 'whiskas'],
              createdAt: '2024-01-20T14:15:00Z'
            },
            {
              id: 'demo-3',
              name: 'Interactive Dog Toy Ball',
              shortDescription: 'Engaging interactive ball toy for dogs that promotes mental stimulation.',
              description: 'Interactive Dog Toy Ball designed to keep your dog entertained and mentally stimulated. Features treat-dispensing capability and durable construction. Key Features: Treat dispensing, Durable rubber, Mental stimulation, Suitable for all sizes.',
              brand: 'PetCo',
              category: { id: 'dog-toys', name: 'Dog Toys' },
              subcategory: 'Interactive Toys',
              productType: 'Toys',
              lifeStage: 'All Life Stages',
              breedSize: 'All Breeds',
              price: 299.99,
              stockQuantity: 0,
              inStock: false,
              weight: 'Medium',
              imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center',
              badges: ['New', 'Interactive'],
              features: [
                'Treat dispensing mechanism',
                'Durable rubber construction',
                'Promotes mental stimulation',
                'Easy to clean'
              ],
              ingredients: 'Natural Rubber, Non-toxic materials',
              benefits: 'Mental stimulation, Reduces boredom, Dental health, Exercise',
              variants: [
                { id: 'v1', weight: 'Small', price: 249.99, stock: 0 },
                { id: 'v2', weight: 'Medium', price: 299.99, stock: 0 },
                { id: 'v3', weight: 'Large', price: 349.99, stock: 0 }
              ],
              rating: 4.7,
              reviewCount: 42,
              tags: ['dog', 'toy', 'interactive', 'treat', 'ball'],
              createdAt: '2024-02-01T09:45:00Z'
            },
            {
              id: 'demo-4',
              name: 'Premium Cat Litter - Clumping Formula',
              shortDescription: 'Ultra-clumping cat litter with odor control for multiple cats.',
              description: 'Premium cat litter made from natural clay with superior clumping action and odor control. Perfect for multi-cat households with long-lasting freshness.',
              brand: 'Fresh Step',
              category: { id: 'cat-litter', name: 'Cat Litter' },
              subcategory: 'Clumping Litter',
              productType: 'Litter',
              lifeStage: 'All Life Stages',
              specialDiet: 'Dust-Free',
              price: 599.99,
              originalPrice: 699.99,
              stockQuantity: 15,
              inStock: true,
              weight: '10kg',
              imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop&crop=center',
              badges: ['Eco-Friendly', 'Odor Control'],
              features: [
                'Superior clumping action',
                '99% dust-free formula',
                'Advanced odor control',
                'Natural clay materials'
              ],
              ingredients: 'Natural Clay, Baking Soda, Natural Minerals',
              benefits: 'Easy cleanup, Odor elimination, Low dust, Long lasting',
              variants: [
                { id: 'v1', weight: '5kg', price: 349.99, originalPrice: 399.99, stock: 20 },
                { id: 'v2', weight: '10kg', price: 599.99, originalPrice: 699.99, stock: 15 }
              ],
              rating: 4.3,
              reviewCount: 67,
              tags: ['cat', 'litter', 'clumping', 'odor-control'],
              createdAt: '2024-01-25T11:20:00Z'
            },
            {
              id: 'demo-5',
              name: 'Comfortable Dog Bed - Memory Foam',
              shortDescription: 'Orthopedic memory foam dog bed for ultimate comfort and joint support.',
              description: 'Luxurious memory foam dog bed designed for maximum comfort and joint support. Features washable cover and non-slip bottom for stability.',
              brand: 'ComfortPaws',
              category: { id: 'dog-bedding', name: 'Dog Bedding' },
              subcategory: 'Beds',
              productType: 'Bedding',
              lifeStage: 'All Life Stages',
              breedSize: 'Large Breed',
              specialDiet: 'Orthopedic',
              price: 1299.99,
              originalPrice: 1499.99,
              stockQuantity: 8,
              inStock: true,
              weight: 'Large',
              imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=center',
              badges: ['Premium', 'Orthopedic'],
              features: [
                'Memory foam construction',
                'Washable removable cover',
                'Non-slip bottom',
                'Joint support design'
              ],
              ingredients: 'Memory Foam, Cotton Cover, Non-slip Rubber Base',
              benefits: 'Joint support, Comfort, Easy maintenance, Durability',
              variants: [
                { id: 'v1', weight: 'Medium', price: 999.99, originalPrice: 1199.99, stock: 12 },
                { id: 'v2', weight: 'Large', price: 1299.99, originalPrice: 1499.99, stock: 8 },
                { id: 'v3', weight: 'XL', price: 1599.99, originalPrice: 1799.99, stock: 5 }
              ],
              rating: 4.8,
              reviewCount: 34,
              tags: ['dog', 'bed', 'memory-foam', 'orthopedic', 'comfort'],
              createdAt: '2024-02-05T16:45:00Z'
            },
            {
              id: 'demo-6',
              name: 'Natural Dog Treats - Chicken Jerky',
              shortDescription: 'All-natural chicken jerky treats made from premium ingredients.',
              description: 'Premium all-natural chicken jerky treats made from free-range chicken. No artificial preservatives or additives. Perfect for training and rewards.',
              brand: 'NaturalBites',
              category: { id: 'dog-treats', name: 'Dog Treats' },
              subcategory: 'Jerky Treats',
              productType: 'Treats',
              lifeStage: 'All Life Stages',
              breedSize: 'All Breeds',
              proteinSource: 'Chicken',
              specialDiet: 'Natural',
              price: 199.99,
              originalPrice: 249.99,
              stockQuantity: 35,
              inStock: true,
              weight: '200g',
              imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=400&fit=crop&crop=center',
              badges: ['Natural', 'Training Treats'],
              features: [
                'Free-range chicken',
                'No artificial preservatives',
                'High protein content',
                'Perfect for training'
              ],
              ingredients: 'Chicken Breast, Natural Flavoring',
              benefits: 'High protein, Natural ingredients, Training aid, Healthy reward',
              variants: [
                { id: 'v1', weight: '100g', price: 119.99, originalPrice: 149.99, stock: 25 },
                { id: 'v2', weight: '200g', price: 199.99, originalPrice: 249.99, stock: 35 },
                { id: 'v3', weight: '500g', price: 449.99, originalPrice: 549.99, stock: 18 }
              ],
              rating: 4.6,
              reviewCount: 89,
              tags: ['dog', 'treats', 'chicken', 'natural', 'training'],
              createdAt: '2024-01-30T09:15:00Z'
            }
          ];
          console.log('Admin Panel: Created sample products for demonstration');
        }
      }

      // Normalize backend products for admin panel
      const normalizedProducts = apiProducts.map((p) => ({
        id: p?.id,
        name: p?.name || p?.title || 'Unnamed Product',
        category: p?.category || p?.categoryId || p?.subcategory || 'misc',
        subcategory: p?.subcategory,
        brand: p?.brand || p?.manufacturer || 'Brand',
        price: p?.price ?? p?.salePrice ?? p?.mrp ?? 0,
        originalPrice: p?.originalPrice ?? p?.mrp ?? p?.price ?? 0,
        rating: p?.rating ?? p?.ratingValue ?? 0,
        image: resolveImageUrl(p),
        imageUrl: p?.imageUrl || null, // keep original relative URL for edit form
        description: p?.description || 'No description available',
        inStock: p?.inStock !== false, // Default to true if not specified
        weight: p?.weight || 'N/A',
        stockQuantity: p?.stockQuantity ?? p?.quantity ?? 0
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.error('Admin Panel: Error loading products:', error);
      // Set empty array as fallback
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmMessage = 'Are you sure you want to delete this product? This will permanently remove the product and all its related data (cart items, order history, wishlist entries).';
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await dataService.deleteProduct(productId);
        console.log('Product deleted successfully:', productId);
        await loadProducts(); // Reload products after successful deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        
        // Show user-friendly error message
        if (error.message?.includes('Internal Server Error')) {
          alert('Server error occurred while deleting the product. Please try again or contact support.');
        } else if (error.message?.includes('404')) {
          alert('Product not found. It may have already been deleted.');
          await loadProducts(); // Refresh the list
        } else {
          alert('Failed to delete product: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProductSaved = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await dataService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-heading font-bold text-foreground">Product Management</h1>
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
              backendStatus === 'online' ? 'bg-green-100 text-green-800' : 
              backendStatus === 'offline' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' ? 'bg-green-600' : 
                backendStatus === 'offline' ? 'bg-red-600' : 
                'bg-yellow-600'
              }`}></div>
              <span>{backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your product catalog
            {backendStatus === 'offline' && ' (Using local fallback data)'}
          </p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center space-x-2" disabled={loading}>
          <Plus size={20} />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
            >
              <option value="" key="all-categories">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-muted relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => handleImageError(e, product.name)}
              />
              {/* Product Badges */}
              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-2 left-2">
                  <span className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
                    {product.badges[0]}
                  </span>
                </div>
              )}
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-md"
                  title="Edit Product"
                >
                  <Edit size={16} className="text-primary" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                  className="p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  title="Delete Product"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
              {/* Stock Status Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
              {/* Product Name and Brand */}
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2 text-lg leading-tight">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mt-1">by {product.brand}</p>
                )}
              </div>

              {/* Product Description */}
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescription || product.description.substring(0, 100)}...
                </p>
              )}

              {/* Category and Type */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </span>
                )}
                {product.subcategory && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {product.subcategory}
                  </span>
                )}
                {product.productType && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {product.productType}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-foreground">₹{product.price?.toFixed(2) || '0.00'}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice?.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-green-600 font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                {product.weight && (
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {product.weight}
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Available Sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.slice(0, 3).map((variant, index) => (
                      <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {variant.weight || variant.size || `Variant ${index + 1}`}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.variants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stock and Rating */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-muted-foreground">
                    Qty: {product.stockQuantity || 0}
                  </span>
                </div>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-muted-foreground">
                      {product.rating?.toFixed(1)} ({product.reviewCount || 0})
                    </span>
                  </div>
                )}
              </div>

              {/* Product Features (if available) */}
              {product.features && product.features.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Key Features:</p>
                  <ul className="text-xs space-y-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-muted-foreground flex items-start">
                        <span className="text-primary mr-1">•</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {product.features.length > 2 && (
                      <li className="text-muted-foreground text-xs">
                        +{product.features.length - 2} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Product Meta Info */}
              <div className="pt-2 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>ID: {product.id}</span>
                {product.createdAt && (
                  <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      {/* Enhanced Product Form Modal */}
      {showProductForm && (
        <EnhancedProductForm
          product={editingProduct}
          onSave={handleProductSaved}
          onCancel={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;