"use client";

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LightGradientAnimation } from '@/components/ui/light-gradient-animation';
import ZeptoProductList from '@/components/ZeptoProductList';

function ZeptoProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get('search');
  const selectedLocation = searchParams.get('location');

  useEffect(() => {
    // If no search term is provided, redirect back to zepto page
    if (!searchTerm) {
      router.push('/zepto');
      return;
    }
  }, [searchTerm, router]);

  if (!searchTerm) {
    return (
      <LightGradientAnimation>
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Redirecting...</h2>
            <p className="text-neutral-400">Taking you back to search</p>
          </div>
        </div>
      </LightGradientAnimation>
    );
  }

  return (
    <LightGradientAnimation>
      <ZeptoProductList 
        initialQuery={searchTerm} 
        initialLocation={selectedLocation || undefined} 
      />
    </LightGradientAnimation>
  );
}

export default function ZeptoProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ZeptoProductsContent />
    </Suspense>
  );
}
