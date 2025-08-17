import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminApiService from '../../services/adminApi';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 20  // Keep 20 per page but add pagination
  });

  // Main useEffect for fetching products
  useEffect(() => {
    fetchProducts();
  }, [filters.page, filters.category]); // Only trigger on page and category changes

  // Separate debounced effect for search
  useEffect(() => {
    if (filters.search === '') {
      // If search is empty, fetch immediately
      fetchProducts();
    } else {
      // Debounce search
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
      
      // Build query parameters
      const queryParams = {
        page: filters.page,
        limit: filters.limit
      };

      // Only add search if it has content
      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }

      // Only add category if selected
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
        
        // Force refresh after deletion
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

  // Pagination handlers
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

  // Force refresh function
  const forceRefresh = () => {
    console.log('🔄 Forcing data refresh...');
    setRefreshTrigger(prev => prev + 1);
  };

  // Update the search input handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      search: value, 
      page: 1 // Reset to first page when searching
    }));
  };

  // Add clear filters function
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <div className="flex gap-2">
          <button
            onClick={forceRefresh}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            title="Refresh Data"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
          <button
            onClick={fetchProducts}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Apply Filters
          </button>
        </div>
        
        {/* Products count and pagination info */}
        <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
          <div>
            Total products: <strong>{pagination.totalProducts}</strong> | 
            Showing: <strong>{products.length}</strong> products
          </div>
          <div>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Try adjusting your filters or add some products.
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
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
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.subCategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stockQuantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 px-2 py-1 border border-indigo-300 rounded hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      pagination.currentPage === 1
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.currentPage - 1) * filters.limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.totalProducts}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePrevPage}
                        disabled={pagination.currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                          pagination.currentPage === 1
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-500 bg-white hover:bg-gray-50'
                        }`}
                      >
                        ←
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={handleNextPage}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                          pagination.currentPage === pagination.totalPages
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-500 bg-white hover:bg-gray-50'
                        }`}
                      >
                        →
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

// Keep your existing ProductModal component unchanged
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
    
    // Validation
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
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'sizes') {
          productData.append(key, JSON.stringify(formData[key]));
        } else {
          productData.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image) => {
        productData.append('images', image);
      });

      // Debug FormData
      console.log('📤 Submitting product data:');
      for (let [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      if (product) {
        await AdminApiService.updateProduct(product._id, productData);
        toast.success('Product updated successfully');
      } else {
        await AdminApiService.createProduct(productData);
        toast.success('Product created successfully');
      }

      onSave();
      
      // Force refresh after save
      setTimeout(() => {
        forceRefresh();
      }, 1000); // Small delay to ensure server processing

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
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (LKR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <label key={size} className="flex items-center">
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
                    className="mr-1"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                className="mr-2"
              />
              Bestseller
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images {!product && '*'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;