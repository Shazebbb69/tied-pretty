import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  Tag,
  LogOut,
  Menu,
  Plus,
  Edit,
  Trash2,
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Percent,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Switch } from '../components/ui/switch';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

// Dashboard Overview
const DashboardOverview = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, discounted: 0 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/categories`),
        ]);
        setProducts(prodRes.data);
        const discountedCount = prodRes.data.filter(p => p.discount_active && p.discount_percentage > 0).length;
        setStats({
          products: prodRes.data.length,
          categories: catRes.data.length,
          discounted: discountedCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid="admin-dashboard-overview">
      <h1 className="text-2xl font-bold text-[#2D283E] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B9E]/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#FF6B9E]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-[#2D283E]" data-testid="stat-products">
                {stats.products}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#82D1B2]/10 flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#82D1B2]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-[#2D283E]" data-testid="stat-categories">
                {stats.categories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD166]/10 flex items-center justify-center">
              <Percent className="w-6 h-6 text-[#FFD166]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">On Discount</p>
              <p className="text-2xl font-bold text-[#2D283E]" data-testid="stat-discounted">
                {stats.discounted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl border-2 border-[#F3E8FF] overflow-hidden">
        <div className="p-4 border-b border-[#F3E8FF]">
          <h2 className="text-lg font-semibold text-[#2D283E]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Recent Products
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.slice(0, 5).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url.startsWith('/') ? `${API_URL}${product.image_url}` : product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{product.category.replace('-', ' ')}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    {product.discount_active && product.discount_percentage > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FFD166]/20 text-[#FFD166]">
                        {product.discount_percentage}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.in_stock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// Products Management
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    in_stock: true,
    discount_percentage: '0',
    discount_active: false,
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/categories`),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      in_stock: true,
      discount_percentage: '0',
      discount_active: false,
    });
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      in_stock: product.in_stock,
      discount_percentage: (product.discount_percentage || 0).toString(),
      discount_active: product.discount_active || false,
    });
    setImagePreview(product.image_url.startsWith('/') ? `${API_URL}${product.image_url}` : product.image_url);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post(`${API_URL}/api/upload`, uploadFormData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ ...formData, image_url: response.data.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload image');
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please upload a product image');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
      };

      if (selectedProduct) {
        await axios.put(`${API_URL}/api/products/${selectedProduct.id}`, payload, {
          withCredentials: true,
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API_URL}/api/products`, payload, {
          withCredentials: true,
        });
        toast.success('Product created successfully');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/products/${selectedProduct.id}`, {
        withCredentials: true,
      });
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete product');
    }
  };

  const toggleDiscount = async (product) => {
    try {
      await axios.put(`${API_URL}/api/products/${product.id}`, {
        discount_active: !product.discount_active,
      }, {
        withCredentials: true,
      });
      toast.success(product.discount_active ? 'Discount disabled' : 'Discount enabled');
      fetchData();
    } catch (error) {
      toast.error('Failed to update discount');
    }
  };

  return (
    <div data-testid="admin-products-management">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2D283E]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Products
        </h1>
        <Button onClick={openCreateDialog} className="bg-[#FF6B9E] hover:bg-[#ff4d8a]" data-testid="add-product-btn">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B9E] border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-[#F3E8FF] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url.startsWith('/') ? `${API_URL}${product.image_url}` : product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{product.category.replace('-', ' ')}</TableCell>
                    <TableCell>
                      <div>
                        {product.discount_active && product.discount_percentage > 0 ? (
                          <>
                            <span className="line-through text-gray-400 text-sm">₹{product.price}</span>
                            <span className="block font-semibold text-[#FF6B9E]">
                              ₹{Math.round(product.price * (1 - product.discount_percentage / 100))}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">₹{product.price}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.discount_percentage > 0 ? (
                          <>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.discount_active 
                                ? 'bg-[#FFD166]/20 text-[#cc9900]' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {product.discount_percentage}% OFF
                            </span>
                            <Switch
                              checked={product.discount_active}
                              onCheckedChange={() => toggleDiscount(product)}
                              className="data-[state=checked]:bg-[#FFD166]"
                            />
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">No discount</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.in_stock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          data-testid={`edit-product-btn-${product.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(product)}
                          data-testid={`delete-product-btn-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Section */}
            <div>
              <Label>Product Image</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#F3E8FF]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image_url: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 rounded-xl border-2 border-dashed border-[#F3E8FF] flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B9E] transition-colors bg-[#FAFAFA]"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B9E] border-t-transparent"></div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="product-image-upload"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Crochet Flower Bouquet"
                required
                data-testid="product-name-input"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
                rows={3}
                required
                data-testid="product-description-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299"
                  required
                  data-testid="product-price-input"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Discount Section */}
            <div className="p-4 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/30">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-5 h-5 text-[#FFD166]" />
                <Label className="text-[#cc9900] font-semibold">Discount Settings</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="0"
                    data-testid="product-discount-input"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2 pb-2">
                    <Switch
                      id="discount_active"
                      checked={formData.discount_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, discount_active: checked })}
                      className="data-[state=checked]:bg-[#FFD166]"
                      data-testid="product-discount-switch"
                    />
                    <Label htmlFor="discount_active">Enable Discount</Label>
                  </div>
                </div>
              </div>
              {formData.discount_active && parseFloat(formData.discount_percentage) > 0 && formData.price && (
                <p className="text-sm text-[#cc9900] mt-2">
                  Final price: <strong>₹{Math.round(parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100))}</strong>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                data-testid="product-stock-switch"
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#FF6B9E] hover:bg-[#ff4d8a]" data-testid="save-product-btn">
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              data-testid="confirm-delete-btn"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-[#F3E8FF] transform transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[#F3E8FF]">
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO_URL} alt="tiedprettyy" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xl font-bold text-[#2D283E]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                tiedprettyy
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#FF6B9E] text-white'
                    : 'text-[#2D283E] hover:bg-[#F3E8FF]'
                }`}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#F3E8FF]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FF6B9E] flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-medium text-[#2D283E]">{user?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b-2 border-[#F3E8FF] px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F3E8FF]"
              data-testid="mobile-menu-toggle"
            >
              <Menu className="w-6 h-6 text-[#2D283E]" />
            </button>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-[#FF6B9E] hover:underline"
                data-testid="view-store-link"
              >
                <ArrowLeft className="w-4 h-4" />
                View Store
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="*" element={<DashboardOverview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
