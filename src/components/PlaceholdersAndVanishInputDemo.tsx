"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { apiService } from "@/services/apiService";
import type { LocationSuggestion, LocationData } from "@/types";

export function PlaceholdersAndVanishInputDemo() {
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [sessionToken, setSessionToken] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);

  const placeholders = [
    "Enter your location (e.g., Connaught Place, Delhi)",
    "Search for your area or landmark",
    "Type your address for delivery",
    "Find your locality for Blinkit delivery",
    "Enter pincode or area name",
  ];

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);
    
    if (query.length > 2) {
      try {
        setLoading(true);
        const response = await apiService.searchLocation(query);
        if (response.success) {
          setSuggestions(response.suggestions);
          setSessionToken(response.sessionToken);
        }
      } catch (error) {
        console.error("Location search failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (locationQuery && suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      await confirmLocation(firstSuggestion);
    }
  };

  const confirmLocation = async (suggestion: LocationSuggestion) => {
    try {
      setLoading(true);
      const response = await apiService.confirmLocation(
        suggestion.meta.place_id as string || "",
        suggestion.title.text,
        suggestion.subtitle.text,
        sessionToken
      );
      
      if (response.success) {
        setConfirmedLocation(response.locationData);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Location confirmation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Find Products on Blinkit
      </h2>
      <p className="text-neutral-400 text-center mb-8 max-w-2xl">
        Enter your location to check Blinkit delivery availability and search for groceries, 
        fresh produce, and daily essentials with lightning-fast delivery.
      </p>
      
      {!confirmedLocation ? (
        <div className="w-full max-w-2xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          
          {/* Location Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 bg-neutral-900 rounded-lg border border-neutral-700 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => confirmLocation(suggestion)}
                  className="w-full p-4 text-left hover:bg-neutral-800 border-b border-neutral-700 last:border-b-0 transition-colors"
                >
                  <div className="text-white font-medium">{suggestion.title.text}</div>
                  <div className="text-neutral-400 text-sm">{suggestion.subtitle.text}</div>
                </button>
              ))}
            </div>
          )}
          
          {loading && (
            <div className="mt-4 text-center text-neutral-400">
              Searching locations...
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-700 max-w-md">
            <h3 className="text-green-400 font-semibold mb-2">✅ Location Confirmed</h3>
            <div className="text-white font-medium">{confirmedLocation.display_address.title}</div>
            <div className="text-neutral-400 text-sm mb-4">{confirmedLocation.display_address.description}</div>
            <div className={`text-sm ${confirmedLocation.is_serviceable && confirmedLocation.is_available ? 'text-green-400' : 'text-red-400'}`}>
              {confirmedLocation.is_serviceable && confirmedLocation.is_available 
                ? '🟢 Blinkit Delivery Available' 
                : '🔴 Blinkit Delivery Not Available'}
            </div>
          </div>
          
          {/* TODO: Add product search component here */}
          <button 
            onClick={() => setConfirmedLocation(null)}
            className="mt-4 px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Change Location
          </button>
        </div>
      )}
    </div>
  );
}
