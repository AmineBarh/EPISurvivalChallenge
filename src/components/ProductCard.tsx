import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain bg-white p-4"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm">{product.rating.rate}</span>
          <span className="ml-2 text-sm text-gray-500">({product.rating.count} reviews)</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};