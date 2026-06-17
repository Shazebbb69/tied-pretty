import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Star,
  Sparkles,
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

const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

// Helper: look up category name by id
const getCategoryName = (categoryId, categories) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.name : '—';
};

// Dashboard Overview
const DashboardOverview = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, discounted: 0 });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*");

        if (productsError) throw productsError;
        if (categoriesError) throw categoriesError;

        setProducts(productsData || []);
        setCategories(categoriesData || []);

        const discountedCount = (productsData || []).filter(
          (p) => p.discount_active && p.discount_percentage > 0
        ).length;

        setStats({
          products: productsData?.length || 0,
          categories: categoriesData?.length || 0,
          discounted: discountedCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div data-testid="admin-dashboard-overview">
      <h1 className="text-2xl font-bold text-[#f5f5f6] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
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
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {getCategoryName(product.category_id, categories)}
                  </TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    {product.discount_active && product.discount_percentage > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FFD166] to-[#FFA500] text-white shadow-sm">
                        <Percent className="w-3 h-3" />
                        {product.discount_percentage}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        product.in_stock
                          ? 'bg-gradient-to-r from-[#82D1B2] to-[#4CAF50] text-white'
                          : 'bg-gradient-to-r from-[#FF6B6B] to-[#FF4757] text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-white animate-pulse' : 'bg-white/60'}`}></span>
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    images: [],
    in_stock: true,
    discount_percentage: '0',
    discount_active: false,
  });

  const fetchData = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (productsError) throw productsError;
      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      category_id: '',
      image_url: '',
      images: [],
      in_stock: true,
      discount_percentage: '0',
      discount_active: false,
    });
    setImagePreviews([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    const allImages =
      product.images && product.images.length > 0
        ? product.images
        : product.image_url
        ? [product.image_url]
        : [];

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      images: allImages,
      in_stock: product.in_stock,
      discount_percentage: (product.discount_percentage || 0).toString(),
      discount_active: product.discount_active || false,
    });

    setImagePreviews(allImages);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        const imageUrl = data.publicUrl;

        setImagePreviews((prev) => [...prev, imageUrl]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
          image_url: prev.image_url || imageUrl,
        }));
      }
      toast.success("Images uploaded");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error?.message || JSON.stringify(error));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image_url: newImages[0] || '',
      };
    });
  };

  const setMainImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.images[index],
    }));
    toast.success('Main image updated');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url,
        in_stock: formData.in_stock,
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        discount_active: formData.discount_active,
      };

      if (selectedProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", selectedProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([payload]);
        if (error) throw error;
      }

      toast.success("Saved");
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error?.message || JSON.stringify(error));
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);
      if (error) throw error;
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete product');
    }
  };

  const toggleDiscount = async (product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ discount_active: !product.discount_active })
        .eq("id", product.id);
      if (error) throw error;
      toast.success(product.discount_active ? 'Discount disabled' : 'Discount enabled');
      fetchData();
    } catch (error) {
      toast.error('Failed to update discount');
    }
  };

  const toggleStock = async (product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: !product.in_stock })
        .eq("id", product.id);
      if (error) throw error;
      toast.success(product.in_stock ? 'Marked as Out of Stock' : 'Marked as In Stock');
      fetchData();
    } catch (error) {
      toast.error('Failed to update stock status');
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
                          src={product.image_url}
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
                    <TableCell className="capitalize">
                      {getCategoryName(product.category_id, categories)}
                    </TableCell>
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
                          <button
                            onClick={() => toggleDiscount(product)}
                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 ${
                              product.discount_active
                                ? 'bg-gradient-to-r from-[#FFD166] to-[#FFA500] text-white shadow-md hover:shadow-lg hover:scale-105'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            data-testid={`discount-toggle-${product.id}`}
                          >
                            <Percent className="w-3.5 h-3.5" />
                            <span>{product.discount_percentage}% OFF</span>
                            <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              product.discount_active ? 'bg-white/30' : 'bg-gray-300'
                            }`}>
                              {product.discount_active ? '✓' : '○'}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No discount set</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleStock(product)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 ${
                          product.in_stock
                            ? 'bg-gradient-to-r from-[#82D1B2] to-[#4CAF50] text-white shadow-md hover:shadow-lg hover:scale-105'
                            : 'bg-gradient-to-r from-[#FF6B6B] to-[#FF4757] text-white shadow-md hover:shadow-lg hover:scale-105'
                        }`}
                        data-testid={`stock-toggle-${product.id}`}
                      >
                        {product.in_stock ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-white/60"></span>
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-[#F3E8FF] shadow-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Multi-Image Upload Section */}
            <div>
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#FF6B9E]" />
                Product Images
                <span className="text-xs text-gray-400">(Multiple allowed)</span>
              </Label>
              <div className="mt-2 space-y-3">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden border-2 ${
                          formData.image_url === formData.images[index]
                            ? 'border-[#FF6B9E] ring-2 ring-[#FF6B9E]/30'
                            : 'border-[#F3E8FF]'
                        }`}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-1 opacity-0 hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setMainImage(index)}
                            className="p-1.5 bg-[#FFD166] text-white rounded-full hover:bg-[#FFA500]"
                            title="Set as main image"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {formData.image_url === formData.images[index] && (
                          <div className="absolute top-1 left-1 bg-[#FF6B9E] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-[#F3E8FF] flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B9E] transition-colors bg-white"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B9E] border-t-transparent"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        {imagePreviews.length > 0 ? 'Add more images' : 'Click to upload images'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF • Different angles, sizes, colors</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
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
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
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
                  Final price:{' '}
                  <strong>
                    ₹{Math.round(parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100))}
                  </strong>
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

// Featured Products Management
const FeaturedProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (productsError) throw productsError;
      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleFeatured = async (product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !product.is_featured })
        .eq("id", product.id);
      if (error) throw error;
      toast.success(product.is_featured ? 'Removed from featured' : 'Added to featured');
      fetchData();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const featuredProducts = products.filter((p) => p.is_featured);
  const nonFeaturedProducts = products.filter((p) => !p.is_featured);

  return (
    <div data-testid="admin-featured-management">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D283E] flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Sparkles className="w-7 h-7 text-[#FFD166]" />
          Featured Products
        </h1>
        <p className="text-gray-500 mt-1">Showcase special products on your homepage for special occasions</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B9E] border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Current Featured Products */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#2D283E] mb-4 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <Star className="w-5 h-5 text-[#FFD166] fill-[#FFD166]" />
              Currently Featured ({featuredProducts.length})
            </h2>

            {featuredProducts.length === 0 ? (
              <div className="bg-[#FFD166]/10 border-2 border-dashed border-[#FFD166] rounded-2xl p-8 text-center">
                <Sparkles className="w-12 h-12 text-[#FFD166] mx-auto mb-3" />
                <p className="text-[#cc9900] font-medium">No featured products yet</p>
                <p className="text-gray-500 text-sm mt-1">Add products from the list below to feature them on your homepage</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border-2 border-[#FFD166] overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-[#FFD166] text-white p-1.5 rounded-full">
                        <Star className="w-4 h-4 fill-white" />
                      </div>
                      {product.discount_active && product.discount_percentage > 0 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF6B9E] to-[#ff4d8a] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#2D283E] truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {getCategoryName(product.category_id, categories)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-[#FF6B9E]">₹{product.price}</span>
                        <button
                          onClick={() => toggleFeatured(product)}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Products to Feature */}
          <div>
            <h2 className="text-lg font-semibold text-[#2D283E] mb-4 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <Package className="w-5 h-5 text-[#82D1B2]" />
              Available Products ({nonFeaturedProducts.length})
            </h2>

            {nonFeaturedProducts.length === 0 ? (
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <p className="text-gray-500">All products are already featured!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {nonFeaturedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border-2 border-[#F3E8FF] overflow-hidden hover:border-[#FFD166] transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-[#2D283E] px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {product.discount_active && product.discount_percentage > 0 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF6B9E] to-[#ff4d8a] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#2D283E] truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {getCategoryName(product.category_id, categories)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-[#FF6B9E]">₹{product.price}</span>
                        <button
                          onClick={() => toggleFeatured(product)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#FFD166] to-[#FFA500] text-white rounded-full text-sm font-medium hover:shadow-md transition-all flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
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
    { name: 'Featured', path: '/admin/featured', icon: Star },
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
            <Route path="featured" element={<FeaturedProductsManagement />} />
            <Route path="*" element={<DashboardOverview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;