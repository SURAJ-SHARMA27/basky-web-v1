// Type definitions for API responses and data structures

export interface LocationData {
  display_address: {
    title: string;
    description: string;
  };
  is_serviceable: boolean;
  is_available: boolean;
  place_id?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LocationSuggestion {
  title: {
    text: string;
  };
  subtitle: {
    text: string;
  };
  left_image?: {
    url: string;
  } | null;
  meta: {
    place_id?: string;
    [key: string]: unknown;
  };
}

export interface LocationSearchResponse {
  success: boolean;
  suggestions: LocationSuggestion[];
  sessionToken: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  brand?: string;
  category?: string;
  availability: boolean;
  unit?: string;
  description?: string;
}

export interface ProductSearchResponse {
  success: boolean;
  products: Product[];
  total_count: number;
  query: string;
}
