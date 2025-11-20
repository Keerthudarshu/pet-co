import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api';
import { X, Plus, Trash2, Upload, Star } from 'lucide-react';
import dataService from '../../../services/dataService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EnhancedProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: '',
    subcategory: '',
    
    // Pricing and Stock
    price: '',
    originalPrice: '',
    stockQuantity: '',
    inStock: true,
    
    // Product Details
    features: [''],
    ingredients: '',
    benefits: '',
    nutrition: {
      protein: '',
      fat: '',
      fiber: '',
      moisture: '',
      ash: '',
      calories: ''
    },
    
    // Product Variants
    variants: [
      {
        id: 'default',
        weight: '',
        price: '',
        originalPrice: '',
        stock: ''
      }
    ],
    
    // Product Metadata
    badges: [''],
    tags: '',
    lifeStage: '',
    breedSize: '',
    productType: '',
    specialDiet: '',
    proteinSource: '',
    
    // Rating (for new products)
    rating: '',
    reviewCount: ''
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Predefined options for dropdowns
  const lifeStageOptions = ['All Life Stages', 'Puppy', 'Adult', 'Senior', 'Kitten'];
  const breedSizeOptions = ['All Breeds', 'Small Breed', 'Medium Breed', 'Large Breed', 'Extra Large Breed'];
  const productTypeOptions = [
    'Dry Food', 'Wet Food', 'Treats', 'Supplements', 'Toys', 'Accessories',
    'Grooming', 'Health & Hygiene', 'Bedding', 'Bowls & Feeders', 'Litter',
    'Training', 'Travel Supplies', 'Clothing'
  ];
  const specialDietOptions = [
    'None', 'Grain-Free', 'Limited Ingredient', 'Weight Management', 'Sensitive Stomach',
    'Hypoallergenic', 'Organic', 'Natural', 'Veterinary Diet'
  ];
  const proteinSourceOptions = [
    'Chicken', 'Beef', 'Fish', 'Lamb', 'Turkey', 'Duck', 'Venison', 
    'Salmon', 'Tuna', 'Vegetarian', 'Mixed Protein'
  ];

  const resolveImageUrl = (candidate) => {
    if (!candidate) return '';
    if (candidate.startsWith('http://') || candidate.startsWith('https://') || candidate.startsWith('data:')) {
      return candidate;
    }
    const base = apiClient?.defaults?.baseURL || '';
    return candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
  };

  useEffect(() => {
    loadCategories();
    if (product) {
      populateFormFromProduct(product);
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const response = await dataService.getCategories();
      setCategories(response?.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback categories
      setCategories([
        { id: 'dog-food', name: 'Dog Food' },
        { id: 'cat-food', name: 'Cat Food' },
        { id: 'dog-treats', name: 'Dog Treats' },
        { id: 'cat-treats', name: 'Cat Treats' },
        { id: 'toys', name: 'Toys' },
        { id: 'accessories', name: 'Accessories' }
      ]);
    }
  };

  const populateFormFromProduct = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      brand: product.brand || '',
      category: product.category?.id || product.category || '',
      subcategory: product.subcategory || '',
      
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      stockQuantity: product.stockQuantity?.toString() || '',
      inStock: product.inStock ?? true,
      
      features: product.features?.length > 0 ? product.features : [''],
      ingredients: Array.isArray(product.ingredients?.primary) 
        ? product.ingredients.primary.join(', ') 
        : product.ingredients || '',
      benefits: Array.isArray(product.benefits) 
        ? product.benefits.join(', ') 
        : product.benefits || '',
      nutrition: {
        protein: product.nutrition?.protein || '',
        fat: product.nutrition?.fat || '',
        fiber: product.nutrition?.fiber || '',
        moisture: product.nutrition?.moisture || '',
        ash: product.nutrition?.ash || '',
        calories: product.nutrition?.calories || ''
      },
      
      variants: product.variants?.length > 0 ? product.variants.map(v => ({
        id: v.id || Date.now().toString(),
        weight: v.weight || '',
        price: v.price?.toString() || '',
        originalPrice: v.originalPrice?.toString() || '',
        stock: v.stock?.toString() || ''
      })) : [
        {
          id: 'default',
          weight: product.weight || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          stock: product.stockQuantity?.toString() || ''
        }
      ],
      
      badges: product.badges?.length > 0 ? product.badges : [''],
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
      lifeStage: product.lifeStage || '',
      breedSize: product.breedSize || '',
      productType: product.productType || '',
      specialDiet: product.specialDiet || '',
      proteinSource: product.proteinSource || '',
      
      rating: product.rating?.toString() || '',
      reviewCount: product.reviewCount?.toString() || ''
    });

    // Handle existing images
    if (product.images?.length > 0) {
      setExistingImages(product.images.map(img => resolveImageUrl(img)));
    } else if (product.imageUrl || product.image) {
      setExistingImages([resolveImageUrl(product.imageUrl || product.image)]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName, index) => {
    if (formData[fieldName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: Date.now().toString(),
        weight: '',
        price: '',
        originalPrice: '',
        stock: ''
      }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        
        // Process features
        features: formData.features.filter(f => f.trim()),
        
        // Process badges
        badges: formData.badges.filter(b => b.trim()),
        
        // Process tags
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        
        // Process variants
        variants: formData.variants.map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          originalPrice: parseFloat(v.originalPrice) || 0,
          stock: parseInt(v.stock) || 0
        }))
      };

      if (product?.id) {
        productData.id = product.id;
      }

      // Handle image uploads
      if (images.length > 0) {
        const form = new FormData();
        form.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        
        for (let i = 0; i < images.length; i++) {
          const compressedImage = await compressImage(images[i]);
          form.append('images', compressedImage);
        }
        
        await dataService.addProduct(form, true);
      } else {
        // No new images, just update product data
        if (product?.id) {
          await dataService.updateProduct(product.id, productData);
        } else {
          await dataService.addProduct(productData);
        }
      }

      onSave();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Product Details' },
    { id: 'variants', label: 'Variants & Pricing' },
    { id: 'images', label: 'Images' },
    { id: 'metadata', label: 'Categories & Tags' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="p-6 space-y-6">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Product Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Brand *
                    </label>
                    <Input
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Short Description *
                  </label>
                  <Input
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    required
                    placeholder="Brief product description (appears in product cards)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="Detailed product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Price *
                    </label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Original Price
                    </label>
                    <Input
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Stock Quantity *
                    </label>
                    <Input
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      required
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-border rounded"
                  />
                  <label className="text-sm font-medium text-foreground">
                    In Stock
                  </label>
                </div>
              </div>
            )}

            {/* Product Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Key Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                        placeholder="Enter a key feature"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('features', index)}
                        disabled={formData.features.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('features')}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Feature
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Ingredients (comma-separated)
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="Chicken, Rice, Vegetables, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Benefits (comma-separated)
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="High protein, Supports digestive health, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nutrition Information
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Protein %</label>
                      <Input
                        name="nutrition.protein"
                        value={formData.nutrition.protein}
                        onChange={handleChange}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Fat %</label>
                      <Input
                        name="nutrition.fat"
                        value={formData.nutrition.fat}
                        onChange={handleChange}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Fiber %</label>
                      <Input
                        name="nutrition.fiber"
                        value={formData.nutrition.fiber}
                        onChange={handleChange}
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Moisture %</label>
                      <Input
                        name="nutrition.moisture"
                        value={formData.nutrition.moisture}
                        onChange={handleChange}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Ash %</label>
                      <Input
                        name="nutrition.ash"
                        value={formData.nutrition.ash}
                        onChange={handleChange}
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Calories/kg</label>
                      <Input
                        name="nutrition.calories"
                        value={formData.nutrition.calories}
                        onChange={handleChange}
                        placeholder="3500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Variant
                  </Button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      {formData.variants.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Weight/Size
                        </label>
                        <Input
                          value={variant.weight}
                          onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                          placeholder="500g, 1kg, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Original Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.originalPrice}
                          onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Stock
                        </label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Product Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Current Images</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Current ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => { e.currentTarget.src = '/assets/images/no_image.png'; }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">New Images</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`New ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metadata Tab */}
            {activeTab === 'metadata' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Subcategory
                    </label>
                    <Input
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      placeholder="Enter subcategory"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Life Stage
                    </label>
                    <select
                      name="lifeStage"
                      value={formData.lifeStage}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="">Select Life Stage</option>
                      {lifeStageOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Breed Size
                    </label>
                    <select
                      name="breedSize"
                      value={formData.breedSize}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="">Select Breed Size</option>
                      {breedSizeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Product Type
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="">Select Product Type</option>
                      {productTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Special Diet
                    </label>
                    <select
                      name="specialDiet"
                      value={formData.specialDiet}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="">Select Special Diet</option>
                      {specialDietOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Protein Source
                  </label>
                  <select
                    name="proteinSource"
                    value={formData.proteinSource}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                  >
                    <option value="">Select Protein Source</option>
                    {proteinSourceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Product Badges
                  </label>
                  {formData.badges.map((badge, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={badge}
                        onChange={(e) => handleArrayFieldChange('badges', index, e.target.value)}
                        placeholder="Enter badge (e.g., 'New', 'Best Seller')"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('badges', index)}
                        disabled={formData.badges.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('badges')}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Badge
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Search Tags (comma-separated)
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="dog, food, premium, organic"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Initial Rating
                    </label>
                    <Input
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Review Count
                    </label>
                    <Input
                      name="reviewCount"
                      type="number"
                      min="0"
                      value={formData.reviewCount}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProductForm;