"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import  ZeptoProductList  from '../../components/ZeptoProductList';
import { LightGradientAnimation } from '../../components/ui/light-gradient-animation';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const location = searchParams.get('location');

  return <ZeptoProductList initialQuery={query || undefined} initialLocation={location || undefined} />;
}

export default function ZeptoSearchResultsPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <LightGradientAnimation />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Searching for products...</p>
            </div>
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </div>
    </div>
  );
}
