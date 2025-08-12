import React, { useContext, useEffect, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import ApiService from '../services/api'; // Add this import

const Collection = () => {
    const { search, showSearch, loading: contextLoading } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [products, setProducts] = useState([]); // Local products state
    const [loading, setLoading] = useState(true); // Local loading state
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(24);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch products from backend with pagination
    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            // Build query parameters
            const params = {
                page: currentPage,
                limit: productsPerPage,
                ...(category.length > 0 && { category: category.join(',') }),
                ...(subCategory.length > 0 && { subCategory: subCategory.join(',') }),
                ...(search && showSearch && { search }),
                ...(sortType !== 'relevant' && { 
                    sortBy: 'price', 
                    sortOrder: sortType === 'low-high' ? 'asc' : 'desc' 
                })
            };

            console.log('🔄 Fetching products with params:', params);

            const response = await ApiService.getProducts(params);
            
            if (response.success) {
                setProducts(response.data.products);
                setTotalProducts(response.data.pagination.totalProducts);
                setTotalPages(response.data.pagination.totalPages);
                
                console.log('✅ Products fetched:', {
                    count: response.data.products.length,
                    totalProducts: response.data.pagination.totalProducts,
                    totalPages: response.data.pagination.totalPages,
                    currentPage: response.data.pagination.currentPage
                });
            }
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            setProducts([]);
            setTotalProducts(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when filters or pagination changes
    useEffect(() => {
        fetchProducts();
    }, [currentPage, category, subCategory, sortType, search, showSearch]);

    // Reset to first page when filters change
    const resetToFirstPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchProducts(); // If already on page 1, fetch immediately
        }
    };

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
        resetToFirstPage();
    }

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setSubCategory(prev => [...prev, e.target.value])
        }
        resetToFirstPage();
    }

    // Debug pagination
    console.log('Pagination Debug:', {
        totalProducts,
        totalPages,
        currentPage,
        productsPerPage,
        showPagination: totalPages > 1,
        productsCount: products.length
    });

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
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
    };

    if (loading) {
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
                    <div className='flex flex-col gap-2 text-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> Men
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/> Women
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> Kids
                        </p>
                    </div>
                </div>
                {/* SubCategory filter*/}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                    {/* Product sort */}
                    <select 
                        value={sortType}
                        onChange={(e) => {
                            setSortType(e.target.value);
                            resetToFirstPage();
                        }} 
                        className='border-2 border-gray-300 text-sm px-2'
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

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
                    {products.length > 0 ? (
                        products.map((item, index) => (
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
                            No products found matching your criteria
                        </div>
                    )}
                </div>

                {/* Pagination - Always show if totalPages > 1 */}
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
                            {getPageNumbers().map((pageNumber, index) => (
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
                        <p>Products Displayed: {products.length}</p>
                        <p>Show Pagination: {totalPages > 1 ? 'Yes' : 'No'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Collection
