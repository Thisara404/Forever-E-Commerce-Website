import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminApiService from '../../services/adminApi';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getProducts(filters);
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await AdminApiService.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
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
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      src={product.image[0]}
                      alt={product.name}
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
                  {product.stockQuantity}
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
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  // Image compression function
  const compressImage = (file, maxSizeMB = 2, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, WebP)');
      return;
    }

    // Check individual file sizes before compression
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024); // 10MB limit before compression
    
    if (oversizedFiles.length > 0) {
      toast.error('Some images are too large. Please select images smaller than 10MB.');
      return;
    }

    try {
      setLoading(true);
      
      // Compress all images
      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file);
          
          // Double-check size after compression
          if (compressed.size > 5 * 1024 * 1024) { // 5MB limit
            // If still too large, compress more aggressively
            return await compressImage(file, 1, 0.6);
          }
          
          return compressed;
        })
      );

      // Create preview URLs
      const previews = compressedImages.map(file => URL.createObjectURL(file));
      
      setImages(compressedImages);
      setImagePreview(previews);
      
      // Show compression info
      const originalSize = files.reduce((sum, file) => sum + file.size, 0);
      const compressedSize = compressedImages.reduce((sum, file) => sum + file.size, 0);
      const savedSize = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      toast.success(`Images compressed successfully! Saved ${savedSize}% space.`);
      
    } catch (error) {
      console.error('Image compression error:', error);
      toast.error('Failed to process images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate field lengths
    if (formData.name.length > 100) {
      toast.error('Product name cannot exceed 100 characters');
      return;
    }

    if (formData.description.length > 500) {
      toast.error('Description cannot exceed 500 characters');
      return;
    }

    // Validate price
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    // Validate stock quantity
    if (formData.stockQuantity < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }

    // Validate sizes
    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
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
      images.forEach((image, index) => {
        productData.append('images', image);
        console.log(`Image ${index + 1}: ${(image.size / 1024 / 1024).toFixed(2)}MB`);
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
      console.error('Product save error:', error);
      
      // Handle validation errors more specifically
      if (error.message === 'Validation failed') {
        toast.error('Please check all fields and try again');
      } else {
        toast.error(error.message || (product ? 'Failed to update product' : 'Failed to create product'));
      }
    } finally {
      setLoading(false);
    }
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
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name * ({formData.name.length}/100 characters)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setFormData({ ...formData, name: e.target.value });
                }
              }}
              className={`w-full border rounded-lg px-3 py-2 ${
                formData.name.length > 90 
                  ? 'border-yellow-400 focus:border-yellow-500' 
                  : formData.name.length === 100
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter product name (max 100 characters)"
            />
            {formData.name.length > 90 && (
              <p className={`text-xs mt-1 ${
                formData.name.length === 100 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {formData.name.length === 100 
                  ? 'Maximum character limit reached!' 
                  : `${100 - formData.name.length} characters remaining`
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description * ({formData.description.length}/500 characters)
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setFormData({ ...formData, description: e.target.value });
                }
              }}
              className={`w-full border rounded-lg px-3 py-2 h-24 ${
                formData.description.length > 450 
                  ? 'border-yellow-400 focus:border-yellow-500' 
                  : formData.description.length === 500
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter product description (max 500 characters)"
            />
            {formData.description.length > 450 && (
              <p className={`text-xs mt-1 ${
                formData.description.length === 500 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {formData.description.length === 500 
                  ? 'Maximum character limit reached!' 
                  : `${500 - formData.description.length} characters remaining`
                }
              </p>
            )}
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
                required
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
            <div className="flex space-x-2">
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
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              disabled={loading}
            />
            <div className="text-xs text-gray-500 mt-1">
              <p>• Accepted formats: JPEG, PNG, WebP</p>
              <p>• Images will be automatically compressed to under 5MB</p>
              <p>• Recommended size: 800x800 pixels</p>
            </div>
            
            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex flex-wrap gap-2">
                  {imagePreview.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
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