// Zepto API Service

export interface ZeptoPrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

export interface ZeptoSearchResponse {
  success: boolean;
  predictions: ZeptoPrediction[];
  error?: string;
}

// Product Search Types
export interface ProductImage {
  height: number;
  hidePadding: boolean;
  id: string;
  lottiePath?: string;
  mediaType: string;
  name: string;
  path: string;
  videoPath?: string;
  width: number;
  sizeInBytes: number;
  metaData?: {
    aspectRatio?: string;
    resizeMode: string;
  };
}

export interface Product {
  brand: string;
  brandId: string;
  countryOfOrigin: string;
  description: string[];
  discountApplicable: boolean;
  howToUse?: string;
  id: string;
  imported: boolean;
  ingredients?: string;
  name: string;
  manufacturerName?: string;
  manufacturerAddress?: string;
}

export interface ProductVariant {
  formattedPacksize: string;
  fssaiLicense: string;
  id: string;
  images: ProductImage[];
  maxAllowedQuantity: number;
  mrp: number;
  packsize: number;
  quantity: number;
  unitOfMeasure: string;
  weightInGms: number;
  ratingSummary?: {
    averageRating: number;
    totalRatings: number;
  };
}

export interface ProductResponse {
  recommendationId: string;
  objectId: string;
  id: string;
  storeId: string;
  product: Product;
  productVariant: ProductVariant;
  discountedSellingPrice: number;
  discountPercent: number;
  discountAmount: number;
  availableQuantity: number;
  outOfStock: boolean;
  mrp: number;
  sellingPrice: number;
  isActive: boolean;
  primaryCategoryName: string;
  primaryCategoryId: string;
}

export interface ProductItem {
  productResponse?: ProductResponse;
  info?: Record<string, unknown>;
  position?: number;
  // Handle sponsored/ad items that might have different structure
  data?: {
    product?: Product;
  };
}

// Generic interface for items that might have different structures
export interface GenericItem extends ProductItem {
  [key: string]: unknown;
}

export interface ProductWidget {
  widgetId: string;
  widgetName: string;
  data: {
    fetchMode: string;
    resolver: {
      useLocal: boolean;
      type: string;
      data: {
        items: ProductItem[];
        title?: string;
        queryId?: string;
        subTitle?: string;
      };
    };
  };
}

export interface ZeptoProductSearchResponse {
  success: boolean;
  productName: string;
  products: ProductWidget[];
  error?: string;
}

// Simplified product interface for UI display
export interface ZeptoProduct {
  id: string;
  objectId: string;
  name: string;
  brand: string;
  description: string;
  price: {
    mrp: number;
    sellingPrice: number;
    discountPercent: number;
    discountAmount: number;
  };
  image: string;
  packSize: string;
  unitOfMeasure: string;
  availableQuantity: number;
  outOfStock: boolean;
  rating: {
    averageRating: number;
    totalRatings: number;
  };
  category: string;
  maxAllowedQuantity: number;
}

// Parse the complex nested response to extract products
export function extractProductsFromResponse(response: ZeptoProductSearchResponse): ZeptoProduct[] {
  const products: ZeptoProduct[] = [];
  
  if (!response.success || !response.products || !Array.isArray(response.products)) {
    return products;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response.products.forEach((widget: any) => {
    // Navigate through the nested structure: data -> resolver -> data -> items
    const items = widget?.data?.resolver?.data?.items;
    if (items && Array.isArray(items)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.forEach((item: any) => {
        // Handle different item types - some might have productResponse, others might have data
        let productResponse = item.productResponse;
        
        // If no direct productResponse, check if it's in item.data  
        if (!productResponse && item.data) {
          productResponse = item.data;
        }
        
        // Skip if no valid product response found or if it's not a product item
        if (!productResponse || !productResponse.product) {
          return;
        }
        
        try {
          const product: ZeptoProduct = {
            id: productResponse.id || productResponse.objectId || '',
            objectId: productResponse.objectId || productResponse.id || '',
            name: productResponse.product?.name || 'Unknown Product',
            brand: productResponse.product?.brand || 'Unknown Brand',
            description: Array.isArray(productResponse.product?.description) 
              ? productResponse.product.description.join(' ')
              : (productResponse.product?.description || ''),
            price: {
              mrp: productResponse.mrp || 0,
              sellingPrice: productResponse.sellingPrice || productResponse.discountedSellingPrice || 0,
              discountPercent: productResponse.discountPercent || 0,
              discountAmount: productResponse.discountAmount || 0,
            },
            image: productResponse.productVariant?.images?.[0]?.path 
              ? `https://cdn.zeptonow.com/${productResponse.productVariant.images[0].path}`
              : '',
            packSize: productResponse.productVariant?.formattedPacksize || '',
            unitOfMeasure: productResponse.productVariant?.unitOfMeasure || '',
            availableQuantity: productResponse.availableQuantity || 0,
            outOfStock: productResponse.outOfStock === true,
            rating: {
              averageRating: productResponse.productVariant?.ratingSummary?.averageRating || 0,
              totalRatings: productResponse.productVariant?.ratingSummary?.totalRatings || 0,
            },
            category: productResponse.primaryCategoryName || '',
            maxAllowedQuantity: productResponse.productVariant?.maxAllowedQuantity || 1,
          };
          products.push(product);
        } catch (error) {
          console.warn('Error parsing product:', error, productResponse);
        }
      });
    }
  });
  
  return products;
}

export async function searchLocations(searchTerm: string, apiBase = "https://basky-api-351464446445.us-central1.run.app"):
  Promise<ZeptoSearchResponse> {
  try {
    const response = await fetch(`${apiBase}/api/zepto/search-locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm }),
    });
    return await response.json();
  } catch {
    return {
      success: false,
      predictions: [],
      error: 'Failed to connect to the API. Make sure the backend is running on port 3004.'
    };
  }
}

export interface ZeptoSelectResponse {
  success: boolean;
  selected_location?: string;
  timestamp?: string;
  place_details?: object;
  delivery_check?: object;
  error?: string;
}

export async function selectLocation(prediction: ZeptoPrediction, apiBase = "https://basky-api-351464446445.us-central1.run.app"): Promise<ZeptoSelectResponse> {
  try {
    const response = await fetch(`${apiBase}/api/zepto/select-location`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
      },
      body: JSON.stringify({
        place_id: prediction.place_id,
        description: prediction.description,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      error: 'Failed to connect to the API. Make sure the backend is running on port 3004.'
    };
  }
}

export async function searchProducts(productName: string, apiBase = "https://basky-api-351464446445.us-central1.run.app"): Promise<ZeptoProductSearchResponse> {
  try {
    const response = await fetch(`${apiBase}/api/zepto/search-products`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      },
      body: JSON.stringify({ productName }),
    });
    
    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      productName,
      products: [],
      error: 'Failed to connect to the API. Make sure the backend is running on port 3004.'
    };
  }
}
