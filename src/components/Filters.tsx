import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Filters } from '../types';

interface FiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  categories: string[];
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    minPrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    maxPrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  minRating: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option className="selected:bg-pink-500 selection:text-white hover:bg-pink-500 hover:text-white text-black font-semibold" key={category} value={category}>
                  {category}  
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};