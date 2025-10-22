"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlinkitProductList from '@/components/BlinkitProductList';
import { LocationData } from '@/services/blinkitApi';

function BlinkitSearchResultsContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const locationDataParam = searchParams.get('locationData');
  const query = searchParams.get('q');

  // Parse locationData from URL parameter
  let locationData: LocationData | undefined;
  if (locationDataParam) {
    try {
      locationData = JSON.parse(decodeURIComponent(locationDataParam));
    } catch (error) {
      console.error('Failed to parse location data:', error);
    }
  }

  return (
    <BlinkitProductList 
      initialQuery={query || undefined}
      initialLocation={location || undefined}
      locationData={locationData}
    />
  );
}

export default function BlinkitSearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Blinkit search results...</p>
        </div>
      </div>
    }>
      <BlinkitSearchResultsContent />
    </Suspense>
  );
}
