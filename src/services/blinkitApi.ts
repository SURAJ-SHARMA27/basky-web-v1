// Blinkit API Service
const BLINKIT_API_BASE = 'https://basky-api-rev-351464446445.asia-south1.run.app/api';

// Types for Blinkit API responses
export interface BlinkitLocationSuggestion {
  title: { text: string };
  subtitle: { text: string };
  left_image: string | null;
  meta: {
    place_id: string;
    session_token: string;
  };
}

export interface BlinkitLocationSearchResponse {
  success: boolean;
  suggestions: BlinkitLocationSuggestion[];
  sessionToken: string;
}

export interface LocationData {
  is_serviceable: boolean;
  is_available: boolean;
  coordinate: {
    lat: number;
    lon: number;
  };
  display_address: {
    title: string;
    description: string;
    address_line: string;
  };
  location_info: {
    sublocalities: string[];
    city: string;
    district: string;
    country: string;
    state: string;
    postal_code: string;
    formatted_address: string;
    premises: string[];
    street: string[];
    landmarks: string[];
  };
}

export interface LocationConfirmResponse {
  success: boolean;
  locationData: LocationData;
  error?: string;
}

export interface BlinkitProductSearchResponse {
  success: boolean;
  products?: any[];
  error?: string;
}

export interface BlinkitProduct {
  id: string;
  objectId?: string;
  name: string;
  brand?: string;
  packSize?: string;
  image?: string;
  price?: {
    sellingPrice: number;
    mrp: number;
    discountPercent: number;
  };
  rating?: {
    averageRating: number;
    totalRatings: number;
  };
  outOfStock: boolean;
  // Additional Blinkit specific fields
  variant?: string;
  inventory?: number;
  available?: boolean;
  offer_tag?: string | null;
  merchant_id?: string;
  group_id?: number;
  platform?: string;
}

class BlinkitApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BLINKIT_API_BASE;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Blinkit API request failed:', error);
      throw error;
    }
  }

  async searchLocation(query: string): Promise<BlinkitLocationSearchResponse> {
    const res = await this.request('/location/search', {
      method: 'POST',
      body: JSON.stringify({ 
        query: query.trim(), 
        lat: '28.4652382', 
        lng: '77.0615957' 
      })
    });

    // Map Blinkit backend response into LocationSearchResponse shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyRes: any = res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (anyRes && anyRes.success && anyRes.data && anyRes.data.ui_data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestions = (anyRes.data.ui_data.suggestions || []).map((s: any) => ({
        title: s.title || { text: '' },
        subtitle: s.subtitle || { text: '' },
        left_image: s.left_image || null,
        meta: s.meta || {}
      }));

      return {
        success: true,
        suggestions,
        sessionToken: anyRes.data.postback_query_params?.session_token || ''
      };
    }

    return { success: false, suggestions: [], sessionToken: '' };
  }

  async confirmLocation(
    placeId: string, 
    title: string, 
    description: string, 
    sessionToken: string
  ): Promise<LocationConfirmResponse> {
    try {
      const res = await this.request('/location/confirm', {
        method: 'POST',
        body: JSON.stringify({
          place_id: placeId,
          title,
          description,
          session_token: sessionToken
        })
      });

      if (res.success && res.locationData) {
        return {
          success: true,
          locationData: res.locationData
        };
      } else {
        return {
          success: false,
          locationData: {} as LocationData,
          error: 'Location confirmation failed'
        };
      }
    } catch (error) {
      console.error('Blinkit location confirm failed:', error);
      return {
        success: false,
        locationData: {} as LocationData,
        error: 'Failed to confirm location'
      };
    }
  }

  async searchProducts(productName: string, sessionToken?: string): Promise<BlinkitProductSearchResponse> {
    try {
      const res = await this.request('/products/search', {
        method: 'POST',
        body: JSON.stringify({ 
          query: productName.trim(),
          sessionToken: sessionToken || ''
        })
      });

      return {
        success: true,
        products: res.products || [],
      };
    } catch (error) {
      console.error('Blinkit product search failed:', error);
      return {
        success: false,
        error: 'Failed to search products'
      };
    }
  }

  async searchBlinkitProducts(query: string, locationData: LocationData): Promise<BlinkitProductSearchResponse> {
    try {
      const res = await this.request('/products/search', {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
          location_data: locationData
        })
      });

      return {
        success: true,
        products: res.products || [],
      };
    } catch (error) {
      console.error('Blinkit product search with location failed:', error);
      return {
        success: false,
        error: 'Failed to search products'
      };
    }
  }
}

// Create and export a singleton instance
export const blinkitApiService = new BlinkitApiService();

// Export the search functions for direct use
export const searchBlinkitLocation = (query: string) => blinkitApiService.searchLocation(query);
export const confirmBlinkitLocation = (placeId: string, title: string, description: string, sessionToken: string) => 
  blinkitApiService.confirmLocation(placeId, title, description, sessionToken);
export const searchBlinkitProducts = (productName: string, sessionToken?: string) => 
  blinkitApiService.searchProducts(productName, sessionToken);
export const searchBlinkitProductsWithLocation = (query: string, locationData: LocationData) => 
  blinkitApiService.searchBlinkitProducts(query, locationData);

// Helper function to extract products from response (similar to Zepto)
export const extractBlinkitProductsFromResponse = (response: BlinkitProductSearchResponse): BlinkitProduct[] => {
  if (!response.success || !response.products) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.products.map((product: any) => {
    // Parse price from string format like "₹35" to number
    const priceMatch = product.price?.match(/₹?(\d+)/);
    const sellingPrice = priceMatch ? parseInt(priceMatch[1]) * 100 : 0; // Convert to paise
    
    // Parse MRP if exists
    const mrpMatch = product.mrp?.match(/₹?(\d+)/);
    const mrp = mrpMatch ? parseInt(mrpMatch[1]) * 100 : sellingPrice;
    
    // Calculate discount if both prices exist
    const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    return {
      id: product.id || Math.random().toString(),
      objectId: product.id,
      name: product.name || 'Unknown Product',
      brand: product.brand,
      packSize: product.variant || product.packSize,
      image: product.image,
      price: {
        sellingPrice: sellingPrice,
        mrp: mrp,
        discountPercent: discountPercent,
      },
      rating: product.rating ? {
        averageRating: product.rating.averageRating || 0,
        totalRatings: product.rating.totalRatings || 0,
      } : undefined,
      outOfStock: !product.available || product.inventory === 0,
      // Blinkit specific fields
      variant: product.variant,
      inventory: product.inventory,
      available: product.available,
      offer_tag: product.offer_tag,
      merchant_id: product.merchant_id,
      group_id: product.group_id,
      platform: product.platform,
    };
  });
};
