import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import ApiService from '../services/api';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { useProducts, useUI } from '../hooks/useReduxSelectors';

const Collection = () => {
    const dispatch = useDispatch();
    const { products, loading: productsLoading } = useProducts();
    const { search, showSearch } = useUI();
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(24);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // Debounced search function
    const fetchProductsData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Build query parameters
            const params = {
                page: currentPage,
                limit: productsPerPage,
            };

            // Add filters only if they exist
            if (category.length > 0) {
                params.category = category.join(',');
            }
            if (subCategory.length > 0) {
                params.subCategory = subCategory.join(',');
            }
            
            // Fix: Only add search if showSearch is true AND search has content
            if (showSearch && search && search.trim().length > 0) {
                params.search = search.trim();
            }
            
            // Add sorting parameters
            if (sortType !== 'relevant') {
                params.sortBy = 'price';
                params.sortOrder = sortType === 'low-high' ? 'asc' : 'desc';
            } else {
                params.sortBy = 'createdAt';
                params.sortOrder = 'desc';
            }

            console.log('🔄 Fetching products with params:', params);

            const response = await ApiService.getProducts(params);
            
            if (response.success) {
                const products = response.data.products || [];
                const pagination = response.data.pagination || {};
                
                setFilterProducts(products);
                setTotalProducts(pagination.totalProducts || 0);
                setTotalPages(pagination.totalPages || 0);
                
                console.log('✅ Products fetched:', {
                    count: products.length,
                    totalProducts: pagination.totalProducts || 0,
                    totalPages: pagination.totalPages || 0,
                    currentPage: pagination.currentPage || 1
                });
            } else {
                console.error('❌ API response not successful:', response);
                setFilterProducts([]);
                setTotalProducts(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            setFilterProducts([]);
            setTotalProducts(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, category, subCategory, sortType, search, showSearch, productsPerPage]);

    // Debounce search - only fetch after user stops typing
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            fetchProductsData();
        }, 300); // 300ms delay

        return () => clearTimeout(delayedSearch);
    }, [fetchProductsData]);

    // Reset to first page when filters change
    const resetToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const toggleCategory = useCallback((e) => {
        const value = e.target.value;
        setCategory(prev => {
            const newCategory = prev.includes(value) 
                ? prev.filter(item => item !== value)
                : [...prev, value];
            console.log('Category updated:', newCategory);
            return newCategory;
        });
        resetToFirstPage();
    }, [resetToFirstPage]);

    const toggleSubCategory = useCallback((e) => {
        const value = e.target.value;
        setSubCategory(prev => {
            const newSubCategory = prev.includes(value) 
                ? prev.filter(item => item !== value)
                : [...prev, value];
            console.log('SubCategory updated:', newSubCategory);
            return newSubCategory;
        });
        resetToFirstPage();
    }, [resetToFirstPage]);

    const handleSortChange = useCallback((e) => {
        const newSortType = e.target.value;
        console.log('Sort changed to:', newSortType);
        setSortType(newSortType);
        resetToFirstPage();
    }, [resetToFirstPage]);

    // Pagination handlers
    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    }, [currentPage, handlePageChange]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, handlePageChange]);

    // Generate page numbers for pagination
    const getPageNumbers = useMemo(() => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    }, [currentPage, totalPages]);

    // Fetch products on mount
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (productsLoading || loading) {
        return (
            <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
                <div className='min-w-60'>
                    <p className='my-2 text-xl'>FILTERS</p>
                </div>
                <div className='flex-1'>
                    <div className='flex justify-between text-base sm:text-2xl mb-4'>
                        <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                    </div>
                    <div className='flex justify-center items-center h-40'>
                        <div className='text-gray-500'>Loading products...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter Options */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
                </p>
                
                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Men'} 
                                checked={category.includes('Men')}
                                onChange={toggleCategory}
                            /> 
                            Men
                        </label>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Women'} 
                                checked={category.includes('Women')}
                                onChange={toggleCategory}
                            /> 
                            Women
                        </label>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Kids'} 
                                checked={category.includes('Kids')}
                                onChange={toggleCategory}
                            /> 
                            Kids
                        </label>
                    </div>
                </div>

                {/* SubCategory filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Topwear'} 
                                checked={subCategory.includes('Topwear')}
                                onChange={toggleSubCategory}
                            /> 
                            Topwear
                        </label>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Bottomwear'} 
                                checked={subCategory.includes('Bottomwear')}
                                onChange={toggleSubCategory}
                            /> 
                            Bottomwear
                        </label>
                        <label className='flex gap-2 cursor-pointer'>
                            <input 
                                className='w-3' 
                                type="checkbox" 
                                value={'Winterwear'} 
                                checked={subCategory.includes('Winterwear')}
                                onChange={toggleSubCategory}
                            /> 
                            Winterwear
                        </label>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(category.length > 0 || subCategory.length > 0) && (
                    <button 
                        onClick={() => {
                            setCategory([]);
                            setSubCategory([]);
                            resetToFirstPage();
                        }}
                        className='mt-4 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors'
                    >
                        Clear All Filters
                    </button>
                )}
            </div>

            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                    {/* Product sort */}
                    <select 
                        value={sortType}
                        onChange={handleSortChange}
                        className='border-2 border-gray-300 text-sm px-2 py-1 rounded focus:outline-none focus:border-gray-500'
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Active Filters Display */}
                {(category.length > 0 || subCategory.length > 0 || (showSearch && search)) && (
                    <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded'>
                        <p className='text-sm font-medium text-blue-800 mb-2'>Active Filters:</p>
                        <div className='flex flex-wrap gap-2'>
                            {category.map(cat => (
                                <span key={cat} className='px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded flex items-center gap-1'>
                                    Category: {cat}
                                    <button 
                                        onClick={() => toggleCategory({ target: { value: cat } })}
                                        className='text-blue-600 hover:text-blue-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {subCategory.map(subCat => (
                                <span key={subCat} className='px-2 py-1 bg-green-200 text-green-800 text-xs rounded flex items-center gap-1'>
                                    Type: {subCat}
                                    <button 
                                        onClick={() => toggleSubCategory({ target: { value: subCat } })}
                                        className='text-green-600 hover:text-green-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {showSearch && search && (
                                <span className='px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded flex items-center gap-1'>
                                    Search: "{search}"
                                    <button 
                                        onClick={() => {
                                            dispatch(setSearch(''));
                                            dispatch(setShowSearch(false));
                                        }}
                                        className='text-purple-600 hover:text-purple-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Products count and pagination info */}
                <div className='flex justify-between items-center mb-4 text-sm text-gray-600'>
                    <p>
                        Showing {totalProducts > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                    </p>
                    {totalPages > 1 && (
                        <p>
                            Page {currentPage} of {totalPages}
                        </p>
                    )}
                </div>

                {/* Map products */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.length > 0 ? (
                        filterProducts.map((item, index) => (
                            <ProductItem 
                                key={item._id || index} 
                                name={item.name} 
                                id={item._id} 
                                price={item.price} 
                                image={item.image}
                            />
                        ))
                    ) : (
                        <div className='col-span-full text-center text-gray-500 py-8'>
                            {search ? `No products found for "${search}"` : 'No products found matching your criteria'}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex justify-center items-center mt-8 mb-8 space-x-2 bg-gray-50 p-4 rounded-lg'>
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm border rounded-md transition-all ${
                                currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            ← Previous
                        </button>

                        {/* Page Numbers */}
                        <div className='flex space-x-1'>
                            {getPageNumbers.map((pageNumber, index) => (
                                pageNumber === '...' ? (
                                    <span key={index} className='px-3 py-2 text-gray-500'>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-3 py-2 text-sm border rounded-md transition-all ${
                                            currentPage === pageNumber
                                                ? 'bg-black text-white border-black shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm border rounded-md transition-all ${
                                currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Debug info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm'>
                        <p><strong>Debug Info:</strong></p>
                        <p>Backend Total Products: {totalProducts}</p>
                        <p>Total Pages: {totalPages}</p>
                        <p>Current Page: {currentPage}</p>
                        <p>Products Per Page: {productsPerPage}</p>
                        <p>Products Displayed: {filterProducts.length}</p>
                        <p>Show Pagination: {totalPages > 1 ? 'Yes' : 'No'}</p>
                        <p>Active Categories: {JSON.stringify(category)}</p>
                        <p>Active SubCategories: {JSON.stringify(subCategory)}</p>
                        <p>Sort Type: {sortType}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Collection;
