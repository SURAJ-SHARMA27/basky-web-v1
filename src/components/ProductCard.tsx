"use client";

import React from 'react';
import Image from 'next/image';
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ZeptoProduct } from '@/services/zeptoApi';
import { BlinkitProduct } from '@/services/blinkitApi';

interface ProductCardProps {
  product: ZeptoProduct | BlinkitProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  // Convert price from paise to rupees (divide by 100)
  const sellingPrice = product.price?.sellingPrice ? Math.floor(product.price.sellingPrice / 100) : 0;
  const mrp = product.price?.mrp ? Math.floor(product.price.mrp / 100) : 0;

  return (
    <CardSpotlight className="h-120 w-full max-w-xl overflow-hidden group cursor-pointer">
      <div className="relative h-full flex flex-col p-2 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl">
        {product.outOfStock && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center rounded-xl backdrop-blur-sm">
            <span className="bg-red-500/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative w-full h-48 mb-4 flex-shrink-0 rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name || 'Product image'}
              width={200}
              height={200}
              className="w-full h-full object-contain p-3 group-hover:scale-110 transition-all duration-500 ease-out"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs font-medium">No Image</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {product.price?.discountPercent && product.price.discountPercent > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {product.price.discountPercent}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow flex flex-col justify-between relative z-20">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight group-hover:text-green-400 transition-colors duration-300">
              {product.name || 'Unknown Product'}
            </h3>
            
            <div className="space-y-1">
              <p className="text-blue-300 text-xs font-medium truncate">
                {product.brand || 'Unknown Brand'}
              </p>
              {product.packSize && (
                <p className="text-gray-400 text-xs truncate bg-gray-800/30 px-2 py-1 rounded-md">
                  {product.packSize}
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-700/50">
            {/* Price Section */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {sellingPrice > 0 && (
                  <span className="text-green-400 font-bold text-lg bg-green-400/10 px-2 py-1 rounded-md">
                    ₹{sellingPrice}
                  </span>
                )}
                {mrp && mrp > sellingPrice && (
                  <span className="text-gray-400 text-sm line-through opacity-75">
                    ₹{mrp}
                  </span>
                )}
              </div>
            </div>

            {/* Rating Section */}
            {product.rating?.averageRating && product.rating.averageRating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md w-fit">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-white text-sm font-medium">
                  {product.rating.averageRating.toFixed(1)}
                </span>
                {product.rating.totalRatings && product.rating.totalRatings > 0 && (
                  <span className="text-gray-300 text-xs">
                    ({product.rating.totalRatings})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
      </div>
    </CardSpotlight>
  );
}
