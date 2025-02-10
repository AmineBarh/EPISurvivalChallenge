import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Filters } from './components/Filters';
import type { Product, Filters as FilterType } from './types';

function App() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<FilterType>({
    search: '',
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    category: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [...new Set(data.map((p: Product) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  React.useEffect(() => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating.rate >= filters.minRating);
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
        />

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Cart />
      </div>
    </div>
  );
}

export default App;