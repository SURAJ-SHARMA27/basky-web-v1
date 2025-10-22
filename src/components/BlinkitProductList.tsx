"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { ProductCard } from '@/components/ProductCard';
import { 
  searchBlinkitProductsWithLocation, 
  extractBlinkitProductsFromResponse,
  type BlinkitProductSearchResponse, 
  type BlinkitProduct,
  type LocationData
} from '@/services/blinkitApi';

interface BlinkitProductListProps {
  initialQuery?: string;
  initialLocation?: string;
  locationData?: LocationData;
}

export default function BlinkitProductList({ initialQuery, initialLocation, locationData }: BlinkitProductListProps) {
  const [products, setProducts] = useState<BlinkitProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery || '');
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || '');
  const [currentLocationData, setCurrentLocationData] = useState<LocationData | null>(locationData || null);
  const router = useRouter();

  const handleProductSearch = useCallback(async (productName: string) => {
    if (!currentLocationData) {
      setError('Location data is required to search products');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setQuery(productName);
    try {
      const response: BlinkitProductSearchResponse = await searchBlinkitProductsWithLocation(productName, currentLocationData);
      if (response.success && response.products) {
        const extractedProducts = extractBlinkitProductsFromResponse(response);
        setProducts(extractedProducts);
        if (extractedProducts.length === 0) {
          setError('No products found for your search');
        }
      } else {
        setError(response.error || 'No products found');
      }
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Product search error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLocationData]);

  useEffect(() => {
    if (initialQuery && locationData) {
      // Only auto-search if we have both query and location data
      setHasSearched(true);
      handleProductSearch(initialQuery);
    } else if (initialLocation) {
      // If we only have location, just set it without searching
      setSelectedLocation(initialLocation);
    }
    
    if (locationData) {
      setCurrentLocationData(locationData);
    }
  }, [initialQuery, initialLocation, locationData, handleProductSearch]);

  const placeholders = [
    'Search for milk, bread, eggs...',
    'Find fresh vegetables and fruits',
    'Look for snacks and beverages',
    'Search for personal care items',
    'Find household essentials',
  ];

  const loadingStates = [
    { text: 'Connecting to Blinkit...' },
    { text: 'Searching products...' },
    { text: 'Fetching fresh groceries...' },
    { text: 'Loading product details...' },
    { text: 'Almost ready!' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
          {(initialLocation || selectedLocation) && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Delivering to:</p>
              <p className="text-white font-medium">{initialLocation || selectedLocation}</p>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            {query ? `Search Results for "${query}"` : 'Blinkit Product Search'}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {query 
              ? `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching your search`
              : 'Find fresh groceries and daily essentials delivered in minutes'
            }
          </p>
        </div>

        {/* Search Bar for new searches */}
        <div className="max-w-2xl mx-auto mb-8">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={e => setInputValue(e.target.value)}
            onSubmit={e => {
              e.preventDefault();
              if (inputValue.trim()) handleProductSearch(inputValue.trim());
            }}
          />
        </div>
        {loading && (
          <div className="flex justify-center mb-8">
            <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={3000} />
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-400 font-semibold mb-2">Search Error</h3>
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => query && handleProductSearch(query)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard 
                  key={`${product.id || product.objectId || 'product'}-${index}`}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
        {!loading && !error && products.length === 0 && hasSearched && query && (
          <div className="text-center py-20">
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">No Products Found</h3>
              <p className="text-gray-400 mb-6">
                We couldn&apos;t find any products matching &quot;{query}&quot;. Try searching for something else.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setInputValue('');
                  setHasSearched(false);
                  setProducts([]);
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
        {!loading && !error && products.length === 0 && !hasSearched && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-lg p-8 max-w-lg mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Shop?</h3>
              <p className="text-gray-300 mb-6">
                Search for your favorite groceries and get them delivered in minutes with Blinkit!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-orange-400 font-semibold">Fresh Produce</div>
                  <div className="text-gray-400">Fruits & Vegetables</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-red-400 font-semibold">Daily Essentials</div>
                  <div className="text-gray-400">Milk, Bread & More</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-yellow-400 font-semibold">Snacks</div>
                  <div className="text-gray-400">Chips, Cookies & Treats</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-pink-400 font-semibold">Personal Care</div>
                  <div className="text-gray-400">Health & Beauty</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
