"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ZeptoProductSearchProps {
  selectedLocation?: string;
}

export function ZeptoProductSearch({ selectedLocation }: ZeptoProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      // Navigate to the dedicated search results page with search term and location
      const params = new URLSearchParams();
      params.set('q', searchTerm.trim());
      if (selectedLocation) {
        params.set('location', selectedLocation);
      }
      router.push(`/zeptoSearchResults?${params.toString()}`);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    handleSearchWithTerm(categoryName);
  };

  const handlePopularItemClick = (itemName: string) => {
    handleSearchWithTerm(itemName);
  };

  const handleSearchWithTerm = async (term: string) => {
    if (term.trim()) {
      setIsSearching(true);
      const params = new URLSearchParams();
      params.set('q', term.trim());
      if (selectedLocation) {
        params.set('location', selectedLocation);
      }
      router.push(`/zeptoSearchResults?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative z-10">
      {/* Loading Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Searching products...</p>
            <p className="text-neutral-400 text-sm">This may take a few seconds</p>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-4xl text-center">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-4">
            🎉 Great! We deliver to your location
          </h2>
          <p className="text-neutral-300 mb-2">Delivering to:</p>
          <p className="text-white font-medium text-lg">
            {selectedLocation || "Your selected location"}
          </p>
        </div>
        
        {/* Product Search Interface */}
        <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-700/50 p-6 sm:p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Search Products on Zepto</h3>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for groceries, fruits, vegetables..."
                className="w-full p-4 pl-12 pr-16 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
              <svg className="absolute left-4 top-4 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4 text-left">Browse Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Fruits & Vegetables', emoji: '🥬' },
                { name: 'Dairy & Eggs', emoji: '🥛' },
                { name: 'Snacks', emoji: '🍿' },
                { name: 'Beverages', emoji: '🥤' }
              ].map((category) => (
                <div 
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name.toLowerCase())}
                  className="p-4 bg-neutral-800 border border-neutral-600 rounded-lg hover:border-green-500 cursor-pointer transition-colors text-center"
                >
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <p className="text-white font-medium text-sm">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Popular Items */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4 text-left">Popular Items</h4>
            <div className="flex flex-wrap gap-2">
              {['Bananas', 'Milk', 'Bread', 'Eggs', 'Tomatoes', 'Onions', 'Rice', 'Apples'].map((item) => (
                <button
                  key={item}
                  onClick={() => handlePopularItemClick(item.toLowerCase())}
                  className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-full text-sm text-neutral-300 hover:text-white hover:border-green-500 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <p className="text-green-400 font-medium">Delivery in 7-10 minutes</p>
            </div>
            <p className="text-neutral-300 text-sm">Free delivery on orders above ₹199</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/zepto')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              ← Choose Different Location
            </button>
            <button
              onClick={() => router.push('/services')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Explore Other Platforms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
