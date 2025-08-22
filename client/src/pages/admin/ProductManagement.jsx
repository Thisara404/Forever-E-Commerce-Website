import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminApiService from '../../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 20
  });

  // Main useEffect for fetching products
  useEffect(() => {
    fetchProducts();
  }, [filters.page, filters.category]);

  // Separate debounced effect for search
  useEffect(() => {
    if (filters.search === '') {
      fetchProducts();
    } else {
      const timeoutId = setTimeout(() => {
        fetchProducts();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching products with filters:', filters);
      
      const queryParams = {
        page: filters.page,
        limit: filters.limit
      };

      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }

      if (filters.category) {
        queryParams.category = filters.category;
      }

      const response = await AdminApiService.getProducts(queryParams);
      console.log('✅ Products response:', response);
      
      if (response.success && response.data) {
        const productList = response.data.products || response.data;
        const paginationData = response.data.pagination || {};
        
        setProducts(Array.isArray(productList) ? productList : []);
        setPagination({
          currentPage: paginationData.currentPage || 1,
          totalPages: paginationData.totalPages || 1,
          totalProducts: paginationData.totalProducts || productList.length
        });
        
        console.log(`📦 Loaded ${productList.length} products (${paginationData.totalProducts || productList.length} total)`);
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        setProducts([]);
        setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0 });
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      toast.error(`Failed to fetch products: ${error.message}`);
      setProducts([]);
      setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('🗑️ Deleting product:', productId);
        await AdminApiService.deleteProduct(productId);
        toast.success('Product deleted successfully');
        forceRefresh();
      } catch (error) {
        console.error('❌ Delete error:', error);
        toast.error(`Failed to delete product: ${error.message}`);
      }
    }
  };

  const handleEditProduct = (product) => {
    console.log('✏️ Editing product:', product);
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const forceRefresh = () => {
    console.log('🔄 Forcing data refresh...');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      search: value, 
      page: 1
    }));
  };

  // ✅ FIXED: Category change handler
  const handleCategoryChange = (value) => {
    setFilters(prev => ({ 
      ...prev, 
      category: value === 'all' ? '' : value, // Convert 'all' back to empty string for API
      page: 1
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      search: '',
      page: 1,
      limit: 20
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={forceRefresh}
            variant="outline"
            size="sm"
          >
            🔄 Refresh
          </Button>
          <Button onClick={handleAddProduct}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
            />
            {/* ✅ FIXED: Select with proper value handling */}
            <Select 
              value={filters.category || 'all'} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Men">Men</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
                <SelectItem value="Kids">Kids</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchProducts} variant="outline">
              Apply Filters
            </Button>
          </div>
          
          <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Total products: <strong>{pagination.totalProducts}</strong> | 
              Showing: <strong>{products.length}</strong> products
            </div>
            <div>
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Try adjusting your filters or add some products.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.image?.[0] || '/placeholder.jpg'}
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/placeholder.jpg';
                              }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium">
                                {product.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {product.subCategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          LKR {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {product.stockQuantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={product.inStock ? 'default' : 'destructive'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditProduct(product)}
                              variant="outline"
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product._id)}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="border-t px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrevPage}
                      disabled={pagination.currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      onClick={handleNextPage}
                      disabled={pagination.currentPage === pagination.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)}{' '}
                    of {pagination.totalProducts} results
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

// Updated ProductModal component with ShadCN
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'Men',
    subCategory: product?.subCategory || 'Topwear',
    sizes: product?.sizes || ['S'],
    bestseller: product?.bestseller || false,
    stockQuantity: product?.stockQuantity || 100
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!product && images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setLoading(true);

    try {
      const productData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'sizes') {
          productData.append(key, JSON.stringify(formData[key]));
        } else {
          productData.append(key, formData[key]);
        }
      });

      images.forEach((image) => {
        productData.append('images', image);
      });

      if (product) {
        await AdminApiService.updateProduct(product._id, productData);
        toast.success('Product updated successfully');
      } else {
        await AdminApiService.createProduct(productData);
        toast.success('Product created successfully');
      }

      onSave();

    } catch (error) {
      console.error('❌ Product save error:', error);
      toast.error(`Failed to ${product ? 'update' : 'create'} product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (LKR) *</Label>
              <Input
                id="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-input rounded-md px-3 py-2 h-24"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subCategory">Sub Category</Label>
              <Select value={formData.subCategory} onValueChange={(value) => setFormData({ ...formData, subCategory: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Topwear">Topwear</SelectItem>
                  <SelectItem value="Bottomwear">Bottomwear</SelectItem>
                  <SelectItem value="Winterwear">Winterwear</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, sizes: [...formData.sizes, size] });
                      } else {
                        setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
                      }
                    }}
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={formData.bestseller}
              onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
            />
            <Label htmlFor="bestseller">Bestseller</Label>
          </div>

          <div>
            <Label htmlFor="images">Product Images {!product && '*'}</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imagePreview.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreview.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : (product ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductManagement;