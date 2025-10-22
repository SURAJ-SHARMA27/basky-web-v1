"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ZeptoProductSearch } from '@/components/ZeptoProductSearch';
import { LightGradientAnimation } from '@/components/ui/light-gradient-animation';
import { selectLocation } from '@/services/zeptoApi';

interface ValidatedLocation {
  location: string;
  timestamp: number;
}

function ZeptoProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedLocation = searchParams.get('location');
  const [isValidatingLocation, setIsValidatingLocation] = useState(true);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const validateLocation = async () => {
      if (!selectedLocation) {
        setErrorMessage('No location provided. Please select a location first.');
        setIsValidatingLocation(false);
        return;
      }

      // Check if this location was recently validated and stored in sessionStorage
      const validatedLocations: ValidatedLocation[] = JSON.parse(sessionStorage.getItem('zeptoValidatedLocations') || '[]');
      const recentValidation = validatedLocations.find((loc: ValidatedLocation) => 
        loc.location === selectedLocation && 
        Date.now() - loc.timestamp < 300000 // Valid for 5 minutes
      );

      if (recentValidation) {
        setIsLocationValid(true);
        setIsValidatingLocation(false);
        return;
      }

      try {
        // Create a prediction object for validation
        const mockPrediction = {
          place_id: `direct_${Date.now()}`,
          description: selectedLocation,
          structured_formatting: {
            main_text: selectedLocation.split(',')[0],
            secondary_text: selectedLocation.split(',').slice(1).join(',').trim()
          }
        };

        const response = await selectLocation(mockPrediction);
        
        if (response.success && response.selected_location) {
          // Store validation in sessionStorage
          const updatedValidations = validatedLocations.filter((loc: ValidatedLocation) => 
            Date.now() - loc.timestamp < 300000 // Keep only recent validations
          );
          updatedValidations.push({
            location: selectedLocation,
            timestamp: Date.now()
          });
          sessionStorage.setItem('zeptoValidatedLocations', JSON.stringify(updatedValidations));
          
          setIsLocationValid(true);
        } else {
          setErrorMessage(response.error || 'Hold tight! We would start delivering there soon');
        }
      } catch {
        setErrorMessage('Hold tight! We would start delivering there soon');
      } finally {
        setIsValidatingLocation(false);
      }
    };

    validateLocation();
  }, [selectedLocation]);

  if (isValidatingLocation) {
    return (
      <LightGradientAnimation>
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Checking delivery availability...</h2>
            <p className="text-neutral-400">Please wait while we verify your location</p>
          </div>
        </div>
      </LightGradientAnimation>
    );
  }

  if (!isLocationValid) {
    return (
      <LightGradientAnimation>
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6">📍</div>
            <h2 className="text-3xl font-bold text-orange-400 mb-4">
              Hold tight! We&apos;re expanding
            </h2>
            <p className="text-neutral-300 mb-2">
              {errorMessage || 'We don\'t deliver to this location yet, but we\'re working on it!'}
            </p>
            {selectedLocation && (
              <p className="text-neutral-500 text-sm mb-8">
                Location: {selectedLocation}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/zepto')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Try Different Location
              </button>
              <button
                onClick={() => router.push('/services')}
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Explore Other Platforms
              </button>
            </div>
          </div>
        </div>
      </LightGradientAnimation>
    );
  }

  return (
    <LightGradientAnimation>
      <ZeptoProductSearch selectedLocation={selectedLocation || undefined} />
    </LightGradientAnimation>
  );
}

export default function ZeptoProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ZeptoProductContent />
    </Suspense>
  );
}
