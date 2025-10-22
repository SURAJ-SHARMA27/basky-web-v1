// API service layer for all backend communications

import type { LocationData, LocationSearchResponse, ProductSearchResponse } from '../types'

const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Location APIs
  async searchLocation(query: string): Promise<LocationSearchResponse> {
    const res = await this.request('/location/search', {
      method: 'POST',
      body: JSON.stringify({ query: query.trim(), lat: '28.4652382', lng: '77.0615957' })
    })

    // Map Blinkit backend response into LocationSearchResponse shape
    const anyRes: unknown = res
    if (anyRes && typeof anyRes === 'object' && anyRes !== null) {
      const response = anyRes as Record<string, unknown>
      if (response.success && response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>
        if (data.ui_data && typeof data.ui_data === 'object') {
          const uiData = data.ui_data as Record<string, unknown>
          const suggestions = Array.isArray(uiData.suggestions) ? uiData.suggestions.map((s: unknown) => {
            if (s && typeof s === 'object') {
              const suggestion = s as Record<string, unknown>
              return {
                title: (suggestion.title && typeof suggestion.title === 'object' && 'text' in suggestion.title) 
                  ? suggestion.title as { text: string } 
                  : { text: '' },
                subtitle: (suggestion.subtitle && typeof suggestion.subtitle === 'object' && 'text' in suggestion.subtitle)
                  ? suggestion.subtitle as { text: string }
                  : { text: '' },
                left_image: (suggestion.left_image && typeof suggestion.left_image === 'object' && 'url' in suggestion.left_image)
                  ? suggestion.left_image as { url: string }
                  : null,
                meta: (suggestion.meta && typeof suggestion.meta === 'object') 
                  ? suggestion.meta as Record<string, unknown>
                  : {}
              }
            }
            return { 
              title: { text: '' }, 
              subtitle: { text: '' }, 
              left_image: null, 
              meta: {} 
            }
          }) : []

          const postbackParams = data.postback_query_params as Record<string, unknown> | undefined
          return {
            success: true,
            suggestions,
            sessionToken: (postbackParams?.session_token as string) || ''
          }
        }
      }
    }

    return { success: false, suggestions: [], sessionToken: '' }
  }

  async confirmLocation(
    placeId: string, 
    title: string, 
    description: string, 
    sessionToken: string
  ): Promise<{ success: boolean; locationData: LocationData }> {
    return this.request('/location/confirm', {
      method: 'POST',
      body: JSON.stringify({
        place_id: placeId,
        title,
        description,
        session_token: sessionToken
      })
    })
  }

  // Product APIs
  async searchBlinkitProducts(query: string, locationData: LocationData): Promise<ProductSearchResponse> {
    return this.request('/products/search', {
      method: 'POST',
      body: JSON.stringify({
        query: query.trim(),
        location_data: locationData
      })
    })
  }

  // Health check
  async healthCheck(): Promise<Record<string, unknown>> {
    return this.request('/', { method: 'GET' })
  }
}

export const apiService = new ApiService()
export default apiService
