import { ApiError, Gate, Route, TransportResponse } from "@/types/api";

// Load API configuration from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const JSONBIN_URL = process.env.EXPO_PUBLIC_JSONBIN_URL;
const JSONBIN_KEY = process.env.EXPO_PUBLIC_JSONBIN_KEY;

/**
 * API Service for interacting with the HyperSpaceTunnelingCorp API
 * Handles authentication, error handling, and provides typed methods for all endpoints
 */
class ApiService {
  /**
   * Generic request handler with authentication and error handling
   * @param endpoint - API endpoint path (e.g., '/gates')
   * @param options - Additional fetch options
   * @returns Parsed JSON response
   * @throws Error if request fails or returns non-OK status
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
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

  /**
   * Get transport recommendation and cost for a given distance, passengers, and parking days
   * @param distance - Distance in AUs
   * @param passengers - Number of passengers
   * @param parking - Number of parking days
   * @returns Transport recommendation with journey cost and parking fee
   */
  async getTransport(distance: number, passengers: number, parking: number): Promise<TransportResponse> {
    return this.request<TransportResponse>(`/transport/${distance}?passengers=${passengers}&parking=${parking}`);
  }

  /**
   * Store user with their Expo push token
   * @param name - User's name
   * @param token - Expo push token
   * @returns Response from the storage service
   */
  async storeUser(name: string, token: string): Promise<any> {
    if (!JSONBIN_URL || !JSONBIN_KEY) {
      console.error("Missing config:", { JSONBIN_URL, JSONBIN_KEY });
      throw new Error("JSONBin configuration missing");
    }

    console.log("Storing user:", name, "with token:", token);

    try {
      // Fetch existing users using /latest endpoint
      const getResponse = await fetch(`${JSONBIN_URL}/latest`, {
        headers: {
          "X-Master-Key": JSONBIN_KEY,
        },
      });

      let users: Array<{ name: string; token: string }> = [];
      if (getResponse.ok) {
        const data = await getResponse.json();
        users = data.record?.users || [];
        console.log("Existing users:", users);
      } else {
        console.log("GET failed:", getResponse.status);
      }

      // Check if user already exists and update, otherwise add new
      const existingUserIndex = users.findIndex((u) => u.name === name);
      if (existingUserIndex >= 0) {
        users[existingUserIndex].token = token;
      } else {
        users.push({ name, token });
      }

      console.log("Updating with users:", users);

      // Update the bin with new users
      const updateResponse = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_KEY,
        },
        body: JSON.stringify({ users }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error("JSONBin PUT error:", errorText);
        console.error("Status:", updateResponse.status);
        throw new Error(`Failed to store user: ${updateResponse.status}`);
      }

      const result = await updateResponse.json();
      console.log("Successfully stored user");
      return result;
    } catch (error) {
      console.error("Failed to store user:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const api = new ApiService();
