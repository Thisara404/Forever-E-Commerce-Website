import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import ApiService from '../services/api';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { useProducts, useUI } from '../hooks/useReduxSelectors';
import { setSearch, setShowSearch } from '../store/slices/uiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

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
            
            const params = {
                page: currentPage,
                limit: productsPerPage,
            };

            if (category.length > 0) {
                params.category = category.join(',');
            }
            if (subCategory.length > 0) {
                params.subCategory = subCategory.join(',');
            }
            
            if (showSearch && search && search.trim().length > 0) {
                params.search = search.trim();
            }
            
            if (sortType !== 'relevant') {
                if (sortType === 'low-high') {
                    params.sortBy = 'price';
                    params.sortOrder = 'asc';
                } else if (sortType === 'high-low') {
                    params.sortBy = 'price';
                    params.sortOrder = 'desc';
                }
            } else {
                params.sortBy = 'createdAt';
                params.sortOrder = 'desc';
            }

            const response = await ApiService.getProducts(params);
            
            if (response.success) {
                setFilterProducts(response.data.products || []);
                setTotalProducts(response.data.pagination?.totalProducts || 0);
                setTotalPages(response.data.pagination?.totalPages || 0);
            } else {
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

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            fetchProductsData();
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [fetchProductsData]);

    const resetToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const toggleCategory = useCallback((e) => {
        const value = e.target.value;
        setCategory(prev => {
            const newCategory = prev.includes(value) 
                ? prev.filter(item => item !== value)
                : [...prev, value];
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
            return newSubCategory;
        });
        resetToFirstPage();
    }, [resetToFirstPage]);

    const handleSortChange = useCallback((e) => {
        const newSortType = e.target.value;
        setSortType(newSortType);
        resetToFirstPage();
    }, [resetToFirstPage]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (productsLoading || loading) {
        return (
            <div className='min-h-screen pt-10 border-t'>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <span className="ml-3 text-muted-foreground">Loading products...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen pt-10 border-t space-y-8'>
            {/* Header */}
            <div className="text-center">
                <div className='text-3xl font-bold tracking-tight mb-2'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                </div>
                <p className="text-muted-foreground">
                    Discover our complete collection of products
                </p>
            </div>

            <div className='grid lg:grid-cols-[300px_1fr] gap-8'>
                {/* Filters Sidebar */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Filters
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilter(!showFilter)}
                                className="lg:hidden"
                            >
                                {showFilter ? '−' : '+'}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={`space-y-6 ${showFilter ? 'block' : 'hidden lg:block'}`}>
                        {/* Categories */}
                        <div>
                            <h3 className="font-medium mb-3">Categories</h3>
                            <div className='space-y-2'>
                                {['Men', 'Women', 'Kids'].map((cat) => (
                                    <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                                        <input 
                                            type="checkbox" 
                                            value={cat} 
                                            checked={category.includes(cat)}
                                            onChange={toggleCategory}
                                            className="rounded"
                                        /> 
                                        <span className="text-sm">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Sub Categories */}
                        <div>
                            <h3 className="font-medium mb-3">Type</h3>
                            <div className='space-y-2'>
                                {['Topwear', 'Bottomwear', 'Winterwear'].map((subCat) => (
                                    <label key={subCat} className='flex items-center gap-2 cursor-pointer'>
                                        <input 
                                            type="checkbox" 
                                            value={subCat} 
                                            checked={subCategory.includes(subCat)}
                                            onChange={toggleSubCategory}
                                            className="rounded"
                                        /> 
                                        <span className="text-sm">{subCat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(category.length > 0 || subCategory.length > 0) && (
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setCategory([]);
                                    setSubCategory([]);
                                    resetToFirstPage();
                                }}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Products Section */}
                <div className='space-y-6'>
                    {/* Sort and Results Info */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div className="text-sm text-muted-foreground">
                            Showing {totalProducts > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                        </div>
                        
                        <select 
                            value={sortType}
                            onChange={handleSortChange}
                            className='border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                        >
                            <option value="relevant">Sort by: Relevant</option>
                            <option value="low-high">Sort by: Low to High</option>
                            <option value="high-low">Sort by: High to Low</option>
                        </select>
                    </div>

                    {/* Active Filters */}
                    {(category.length > 0 || subCategory.length > 0 || (showSearch && search)) && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {category.map(cat => (
                                        <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory({ target: { value: cat } })}>
                                            Category: {cat} ×
                                        </Badge>
                                    ))}
                                    {subCategory.map(subCat => (
                                        <Badge key={subCat} variant="secondary" className="cursor-pointer" onClick={() => toggleSubCategory({ target: { value: subCat } })}>
                                            Type: {subCat} ×
                                        </Badge>
                                    ))}
                                    {showSearch && search && (
                                        <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                                            dispatch(setSearch(''));
                                            dispatch(setShowSearch(false));
                                        }}>
                                            Search: "{search}" ×
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Products Grid */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
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
                            <div className='col-span-full text-center py-16'>
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                <p className='text-muted-foreground'>
                                    {search ? `No products found for "${search}"` : 'Try adjusting your filters'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex justify-center items-center gap-2'>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            
                            <span className="text-sm text-muted-foreground px-4">
                                Page {currentPage} of {totalPages}
                            </span>
                            
                            <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Collection;
