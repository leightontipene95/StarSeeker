import { ApiError, Gate, Route } from "@/types/api";

// Load API configuration from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

/**
 * API Service for interacting with the HyperSpace Travel API
 * Handles authentication, error handling, and provides typed methods for all endpoints
 */
class ApiService {
  /**
   * Generic request handler with authentication and error handling
   * @param endpoint - API endpoint path (e.g., '/gates')
   * @returns Parsed JSON response
   * @throws Error if request fails or returns non-OK status
   */
  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Fetch all available hyperspace gates
   * @returns Array of all gates in the network
   */
  async getGates(): Promise<Gate[]> {
    return this.request<Gate[]>("/gates");
  }

  /**
   * Fetch details for a specific gate by code
   * @param gateCode - Gate code (e.g., 'SOL', 'SIR')
   * @returns Gate details including connections
   */
  async getGate(gateCode: string): Promise<Gate> {
    return this.request<Gate>(`/gates/${gateCode}`);
  }

  /**
   * Calculate optimal route between two gates
   * @param fromCode - Starting gate code
   * @param toCode - Destination gate code
   * @returns Route with path and total cost in HU (Hyperspace Units)
   */
  async getRoute(fromCode: string, toCode: string): Promise<Route> {
    return this.request<Route>(`/gates/${fromCode}/to/${toCode}`);
  }
}

// Export singleton instance
export const api = new ApiService();
