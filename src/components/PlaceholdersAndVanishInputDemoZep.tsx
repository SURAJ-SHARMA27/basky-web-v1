"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { searchLocations, selectLocation, ZeptoPrediction } from "@/services/zeptoApi";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
  const loadingStates = [
    { text: "Searching for your location..." },
    { text: "Checking Zepto service availability" },
    { text: "Verifying delivery zones" },
    { text: "Finding nearby Zepto stores" },
    { text: "Confirming address details" },
    { text: "Loading location suggestions" },
    { text: "Almost ready..." },
  ];

export function PlaceholdersAndVanishInputDemoZep() {
  const [searchTerm, setSearchTerm] = useState("");
  const [predictions, setPredictions] = useState<ZeptoPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const placeholders = [
    "Enter your location (e.g., Malik Residency)",
    "Search for your area or landmark",
    "Type your address for Zepto delivery",
    "Find your locality for Zepto",
    "Enter pincode or area name",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError("");
    // No API call here; only update local state
    setPredictions([]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    setLoading(true);
    setError('');
    setPredictions([]);
    const data = await searchLocations(searchTerm);
    if (data.success) {
      setPredictions(data.predictions || []);
      if (data.predictions.length === 0) {
        setError('No locations found for this search term');
      }
    } else {
      setError(data.error || 'Failed to search locations');
    }
    setLoading(false);
  };

  const handleSelectLocation = async (prediction: ZeptoPrediction) => {
    setLoading(true);
    setError('');
    const data = await selectLocation(prediction);
    
    if (data.success && data.selected_location) {
      // Success: Store validation and navigate to product search page
      const validatedLocations: Array<{location: string, timestamp: number}> = JSON.parse(sessionStorage.getItem('zeptoValidatedLocations') || '[]');
      const updatedValidations = validatedLocations.filter((loc: {location: string, timestamp: number}) => 
        Date.now() - loc.timestamp < 300000 // Keep only recent validations
      );
      updatedValidations.push({
        location: prediction.description,
        timestamp: Date.now()
      });
      sessionStorage.setItem('zeptoValidatedLocations', JSON.stringify(updatedValidations));
      
      router.push(`/zeptoSearchResults?location=${encodeURIComponent(prediction.description)}`);
      setPredictions([]); // Hide dropdown after selection
    } else {
      // Error: Show delivery not available message
      setError(data.error || 'Sorry, we don\'t deliver to this location');
    }
    setLoading(false);
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      {/* Loading Modal Overlay */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2800} loop={false} />

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}

      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-white">
        Find Products on Zepto
      </h2>
      <p className="text-neutral-400 text-center mb-8 max-w-2xl">
        Enter your location to check Zepto delivery availability and search for groceries, 
        fresh produce, and daily essentials with lightning-fast delivery.
      </p>
      
      <div className="w-full max-w-2xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          {error && <div className="text-red-400 mb-2">{error}</div>}
          {predictions.length > 0 && (
            <div 
              className="relative z-50 bg-neutral-900 rounded-xl border border-neutral-700 shadow-xl max-h-80 w-full mt-4 mx-auto"
              style={{ 
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(38, 38, 38, 0.5)'
              }}
            >
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 z-10">
                <h3 className="p-3 text-green-400 font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Found {predictions.length} location{predictions.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="p-2">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    className="p-3 mb-1 last:mb-0 rounded-lg border border-transparent hover:border-green-500/30 hover:bg-neutral-800 cursor-pointer group"
                    onClick={() => handleSelectLocation(prediction)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.borderColor = '#4ade8080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Location icon */}
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center mt-1">
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      
                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm mb-1">
                          {prediction.structured_formatting?.main_text || prediction.description.split(',')[0]}
                        </div>
                        <div className="text-neutral-400 text-xs">
                          {prediction.structured_formatting?.secondary_text || prediction.description.split(',').slice(1).join(',').trim()}
                        </div>
                      </div>
                      
                      {/* Arrow icon */}
                      <div className="flex-shrink-0 w-4 h-4 text-neutral-500 group-hover:text-green-400 mt-1">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      
      {/* Product Search has been moved to a separate route */}
    </div>
  );
}
