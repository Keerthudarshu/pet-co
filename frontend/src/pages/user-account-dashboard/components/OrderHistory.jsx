import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { downloadInvoice, printInvoice } from '../../../utils/invoiceGenerator';
import orderApi from '../../../services/orderApi';
import dataService from '../../../services/dataService';
import apiClient from '../../../services/api';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingInvoice, setProcessingInvoice] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Resolve product image URL to absolute path served by backend
  const resolveImageUrl = (candidate) => {
    if (!candidate || typeof candidate !== 'string') return '';
    if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:')) return candidate;
    // Extract filename if OS path or contains backslashes
    if (/^[a-zA-Z]:\\/.test(candidate) || candidate.startsWith('\\\\') || candidate.startsWith('/') || candidate.includes('\\')) {
      const parts = candidate.split(/\\|\//);
      candidate = parts[parts.length - 1];
    }
    // Map bare filename to API image route
    if (/^[^/]+\.[a-zA-Z0-9]+$/.test(candidate)) {
      candidate = `/admin/products/images/${candidate}`;
    }
    const base = apiClient?.defaults?.baseURL || '';
    return candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
  };

  // Fetch user orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userOrders = await orderApi.getUserOrders(user.email);
        // Normalize each order item's image
        const normalized = (userOrders || []).map((order) => ({
          ...order,
          items: (order?.items || []).map((item) => {
            const resolved = resolveImageUrl(item?.productImage || item?.image || item?.imageUrl || '');
            return { ...item, productImage: resolved };
          }),
        }));
        setOrders(normalized);
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.log('Using sample order data for demonstration in Order History');
        
        // Add comprehensive sample order data for demonstration
        const sampleOrders = [
          {
            id: 'ORD-001',
            orderNumber: 'PC-2024-001',
            status: 'delivered',
            total: 1299.99,
            subtotal: 1199.99,
            shippingFee: 100.00,
            discount: 0,
            paymentMethod: 'Credit Card',
            createdAt: '2024-11-01T10:30:00Z',
            deliveredAt: '2024-11-03T14:20:00Z',
            trackingNumber: 'TRK123456789',
            shipping: {
              name: 'John Doe',
              phone: '+91 9876543210',
              street: '123 Pet Street, Apartment 4B',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001'
            },
            items: [
              {
                id: 'item-1',
                productName: 'Royal Canin Adult Dog Food - Chicken & Rice',
                productImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop&crop=center',
                brand: 'Royal Canin',
                variant: '1kg',
                quantity: 1,
                price: 899.99,
                category: 'Dog Food',
                description: 'Complete nutrition for adult dogs with high-quality chicken and rice formula.'
              },
              {
                id: 'item-2',
                productName: 'Interactive Dog Toy Ball',
                productImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=center',
                brand: 'PetCo',
                variant: 'Medium',
                quantity: 1,
                price: 299.99,
                category: 'Dog Toys',
                description: 'Engaging interactive ball toy that promotes mental stimulation.'
              }
            ]
          },
          {
            id: 'ORD-002',
            orderNumber: 'PC-2024-002',
            status: 'shipped',
            total: 189.98,
            subtotal: 179.98,
            shippingFee: 10.00,
            discount: 0,
            paymentMethod: 'UPI',
            createdAt: '2024-10-28T14:45:00Z',
            shippedAt: '2024-10-30T09:30:00Z',
            trackingNumber: 'TRK987654321',
            expectedDelivery: '2024-11-12T18:00:00Z',
            shipping: {
              name: 'Sarah Johnson',
              phone: '+91 8765432109',
              street: '456 Dog Avenue, Block C',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001'
            },
            items: [
              {
                id: 'item-3',
                productName: 'Whiskas Cat Food - Ocean Fish Flavor',
                productImage: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=200&h=200&fit=crop&crop=center',
                brand: 'Whiskas',
                variant: '85g Pack of 2',
                quantity: 1,
                price: 179.98,
                category: 'Cat Food',
                description: 'Delicious ocean fish flavored wet food with complete nutrition.'
              }
            ]
          },
          {
            id: 'ORD-003',
            orderNumber: 'PC-2024-003',
            status: 'processing',
            total: 1949.97,
            subtotal: 1849.97,
            shippingFee: 100.00,
            discount: 0,
            paymentMethod: 'Cash on Delivery',
            createdAt: '2024-10-25T11:20:00Z',
            estimatedShipping: '2024-11-13T12:00:00Z',
            shipping: {
              name: 'Priya Sharma',
              phone: '+91 7654321098',
              street: '789 Cat Lane, Villa 15',
              city: 'Chennai',
              state: 'Tamil Nadu',
              pincode: '600001'
            },
            items: [
              {
                id: 'item-4',
                productName: 'Comfortable Dog Bed - Memory Foam',
                productImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=center',
                brand: 'ComfortPaws',
                variant: 'Large',
                quantity: 1,
                price: 1299.99,
                category: 'Dog Bedding',
                description: 'Orthopedic memory foam dog bed for ultimate comfort and joint support.'
              },
              {
                id: 'item-5',
                productName: 'Premium Cat Litter - Clumping Formula',
                productImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop&crop=center',
                brand: 'Fresh Step',
                variant: '10kg',
                quantity: 1,
                price: 599.99,
                category: 'Cat Litter',
                description: 'Ultra-clumping cat litter with advanced odor control.'
              }
            ]
          },
          {
            id: 'ORD-004',
            orderNumber: 'PC-2024-004',
            status: 'pending',
            total: 549.98,
            subtotal: 499.98,
            shippingFee: 50.00,
            discount: 0,
            paymentMethod: 'Net Banking',
            createdAt: '2024-10-22T16:20:00Z',
            shipping: {
              name: 'Mike Thompson',
              phone: '+91 6543210987',
              street: '321 Pet Paradise, Tower A',
              city: 'Hyderabad',
              state: 'Telangana',
              pincode: '500001'
            },
            items: [
              {
                id: 'item-6',
                productName: 'Natural Dog Treats - Chicken Jerky',
                productImage: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=200&h=200&fit=crop&crop=center',
                brand: 'NaturalBites',
                variant: '500g',
                quantity: 1,
                price: 449.99,
                category: 'Dog Treats',
                description: 'All-natural chicken jerky treats made from premium ingredients.'
              }
            ]
          },
          {
            id: 'ORD-005',
            orderNumber: 'PC-2024-005',
            status: 'cancelled',
            total: 799.98,
            subtotal: 799.98,
            shippingFee: 0.00,
            discount: 0,
            paymentMethod: 'Wallet',
            createdAt: '2024-10-18T11:30:00Z',
            cancelledAt: '2024-10-19T09:15:00Z',
            cancelReason: 'Customer requested cancellation',
            shipping: {
              name: 'Anita Kumar',
              phone: '+91 5432109876',
              street: '654 Animal Street',
              city: 'Pune',
              state: 'Maharashtra',
              pincode: '411001'
            },
            items: [
              {
                id: 'item-7',
                productName: 'Cat Scratching Post - Tall Tower',
                productImage: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200&h=200&fit=crop&crop=center',
                brand: 'FelineFun',
                variant: '120cm Height',
                quantity: 1,
                price: 799.98,
                category: 'Cat Furniture',
                description: 'Multi-level scratching post with sisal rope and plush platforms.'
              }
            ]
          },
          {
            id: 'ORD-006',
            orderNumber: 'PC-2024-006',
            status: 'delivered',
            total: 359.97,
            subtotal: 349.97,
            shippingFee: 10.00,
            discount: 0,
            paymentMethod: 'UPI',
            createdAt: '2024-10-15T13:45:00Z',
            deliveredAt: '2024-10-17T15:30:00Z',
            trackingNumber: 'TRK456789123',
            shipping: {
              name: 'Lisa Anderson',
              phone: '+91 3210987654',
              street: '159 Furry Friends Lane',
              city: 'Ahmedabad',
              state: 'Gujarat',
              pincode: '380001'
            },
            items: [
              {
                id: 'item-8',
                productName: 'Dog Grooming Kit - Professional',
                productImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&crop=center',
                brand: 'GroomPro',
                variant: 'Complete Set',
                quantity: 1,
                price: 349.97,
                category: 'Dog Grooming',
                description: 'Professional grooming kit with brushes, nail clippers, and shampoo.'
              }
            ]
          },
          {
            id: 'ORD-007',
            orderNumber: 'PC-2024-007',
            status: 'delivered',
            total: 1289.96,
            subtotal: 1189.96,
            shippingFee: 100.00,
            discount: 50.00,
            paymentMethod: 'Credit Card',
            createdAt: '2024-10-10T08:30:00Z',
            deliveredAt: '2024-10-14T11:20:00Z',
            trackingNumber: 'TRK789123456',
            shipping: {
              name: 'Ramesh Gupta',
              phone: '+91 2109876543',
              street: '753 Pet Supplies Street',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302001'
            },
            items: [
              {
                id: 'item-9',
                productName: 'Premium Dog Kennel - Weather Resistant',
                productImage: 'https://images.unsplash.com/photo-1553736277-055142d4db72?w=200&h=200&fit=crop&crop=center',
                brand: 'SafeHaven',
                variant: 'Large Size',
                quantity: 1,
                price: 1189.96,
                category: 'Dog Housing',
                description: 'Durable outdoor kennel with weather-resistant coating and ventilation.'
              }
            ]
          }
        ];
        
        setOrders(sampleOrders);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const filteredOrders = filterStatus === 'all' 
    ? (Array.isArray(orders) ? orders : [])
    : (Array.isArray(orders) ? orders.filter(order => order?.status === filterStatus) : []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'shipped':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDownloadInvoice = async (order) => {
    setProcessingInvoice(`download-${order.id}`);
    try {
      // Enhanced company settings
      const settings = {
        siteName: "PET&CO",
        companyAddress: "Natural & Organic Products Hub, Bangalore, India",
        companyPhone: "+91 9845651468",
        companyEmail: "info@neenusnatural.com"
      };
      
      // Enhanced customer data mapping with better fallbacks
      const customer = {
        name: order.shipping?.name || order.customerName || user?.name || 'Valued Customer',
        email: order.customerEmail || user?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || user?.phone || 'N/A'
      };
      
      // Enhanced order data with proper formatting matching backend structure
      const enhancedOrder = {
        ...order,
        orderNumber: order.orderNumber || `NN-${new Date().getFullYear()}-${String(order.id).padStart(3, '0')}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: order.items || order.orderItems || [],
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'Not specified',
        status: order.status || 'pending',
        shipping: order.shipping || {
          name: customer.name,
          phone: customer.phone,
          street: 'Address not provided',
          city: 'N/A',
          state: 'N/A',
          pincode: 'N/A'
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX
      downloadInvoice(enhancedOrder, customer, settings);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setProcessingInvoice(null);
    }
  };

  const handlePrintInvoice = async (order) => {
    setProcessingInvoice(`print-${order.id}`);
    try {
      // Enhanced company settings
      const settings = {
        siteName: "PET&CO",
        companyAddress: "Natural & Organic Products Hub, Bangalore, India",
        companyPhone: "+91 9845651468",
        companyEmail: "info@neenusnatural.com"
      };
      
      // Enhanced customer data mapping with better fallbacks
      const customer = {
        name: order.shipping?.name || order.customerName || user?.name || 'Valued Customer',
        email: order.customerEmail || user?.email || 'N/A',
        phone: order.shipping?.phone || order.customerPhone || user?.phone || 'N/A'
      };
      
      // Enhanced order data with proper formatting matching backend structure
      const enhancedOrder = {
        ...order,
        orderNumber: order.orderNumber || `NN-${new Date().getFullYear()}-${String(order.id).padStart(3, '0')}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: order.items || order.orderItems || [],
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'Not specified',
        status: order.status || 'pending',
        shipping: order.shipping || {
          name: customer.name,
          phone: customer.phone,
          street: 'Address not provided',
          city: 'N/A',
          state: 'N/A',
          pincode: 'N/A'
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
      printInvoice(enhancedOrder, customer, settings);
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to print invoice. Please try again.');
    } finally {
      setProcessingInvoice(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Order History
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Order History
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Order History
        </h1>
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="font-body text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-foreground mb-2">
              No orders found
            </h3>
            <p className="font-body text-muted-foreground mb-4">
              {filterStatus === 'all' ? "You haven't placed any orders yet." : `No orders with status"${filterStatus}" found.`
              }
            </p>
            <Button variant="default">
              Start Shopping
            </Button>
          </div>
        ) : (
          filteredOrders?.map((order) => (
            <div key={order?.id} className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-body font-semibold text-foreground">
                        Order #{order?.id}
                      </h3>
                      <p className="font-caption text-sm text-muted-foreground">
                        Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'} • {order?.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-data font-semibold text-foreground">
                        ₹{order?.total?.toFixed(2)}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-caption font-medium border ${getStatusColor(order?.status)}`}>
                        {order?.status}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order?.id)}
                      className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
                    >
                      <Icon 
                        name={expandedOrder === order?.id ? "ChevronUp" : "ChevronDown"} 
                        size={20} 
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order?.id && (
                <div className="p-4 space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-body font-medium text-foreground mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order?.items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            {item?.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Icon name="Package" size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-body font-medium text-foreground truncate">
                              {item?.productName || 'Product'}
                            </h5>
                            <p className="font-caption text-sm text-muted-foreground">
                              Qty: {item?.quantity} • ₹{item?.price?.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-data font-semibold text-foreground">
                              ₹{((item?.price || 0) * (item?.quantity || 0))?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-body font-medium text-foreground mb-2">
                        Shipping Address
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="font-body text-sm text-foreground">
                          {order?.shipping?.name || 'N/A'}
                        </p>
                        <p className="font-caption text-sm text-muted-foreground">
                          {order?.shipping?.street || 'N/A'}
                        </p>
                        <p className="font-caption text-sm text-muted-foreground">
                          {order?.shipping?.city || 'N/A'}, {order?.shipping?.state || 'N/A'} {order?.shipping?.pincode || 'N/A'}
                        </p>
                        <p className="font-caption text-sm text-muted-foreground">
                          {order?.shipping?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-body font-medium text-foreground mb-2">
                        Order Summary
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between font-caption text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-data">₹{order?.subtotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between font-caption text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-data">
                            {order?.shippingFee === 0 ? 'Free' : `₹${order?.shippingFee?.toFixed(2) || '0.00'}`}
                          </span>
                        </div>
                        <div className="flex justify-between font-caption text-sm">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-data capitalize">{order?.paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between font-caption text-sm">
                          <span className="text-muted-foreground">Delivery</span>
                          <span className="font-data capitalize">{order?.deliveryOption || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between font-body font-semibold pt-2 border-t border-border">
                          <span>Total</span>
                          <span className="font-data">₹{order?.total?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order?.trackingNumber && (
                    <div>
                      <h4 className="font-body font-medium text-foreground mb-2">
                        Tracking Information
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="font-caption text-sm text-muted-foreground mb-1">
                          Tracking Number
                        </p>
                        <p className="font-data font-medium text-foreground">
                          {order?.trackingNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {/* {order?.status?.toLowerCase() === 'delivered' && (
                      <Button variant="default" size="sm">
                        Reorder
                      </Button>
                    )}
                    {(order?.status?.toLowerCase() === 'processing' || order?.status?.toLowerCase() === 'shipped') && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )} */}
                    {/* {order?.status?.toLowerCase() === 'processing' && (
                      <Button variant="destructive" size="sm">
                        Cancel Order
                      </Button>
                    )} */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(order)}
                      disabled={processingInvoice === `download-${order.id}`}
                      className={processingInvoice === `download-${order.id}` ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {processingInvoice === `download-${order.id}` ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          Downloading...
                        </>
                      ) : (
                        'Download Invoice'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePrintInvoice(order)}
                      disabled={processingInvoice === `print-${order.id}`}
                      className={processingInvoice === `print-${order.id}` ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {processingInvoice === `print-${order.id}` ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          Printing...
                        </>
                      ) : (
                        'Print Invoice'
                      )}
                    </Button>
                    {/* {order?.status?.toLowerCase() === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Return/Exchange
                      </Button>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;