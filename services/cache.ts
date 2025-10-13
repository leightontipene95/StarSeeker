import { Gate } from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GATES_CACHE_KEY = "@starseeker:gates";
const CACHE_TIMESTAMP_KEY = "@starseeker:gates_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cache Service for managing AsyncStorage operations
 */
class CacheService {
  /**
   * Save gates to AsyncStorage with timestamp
   */
  async saveGates(gates: Gate[]): Promise<void> {
    try {
      const timestamp = Date.now();
      await AsyncStorage.multiSet([
        [GATES_CACHE_KEY, JSON.stringify(gates)],
        [CACHE_TIMESTAMP_KEY, timestamp.toString()],
      ]);
    } catch (error) {
      console.error("Failed to save gates to cache:", error);
    }
  }

  /**
   * Get gates from AsyncStorage if cache is still valid
   * @returns Cached gates or null if cache is invalid/expired
   */
  async getGates(): Promise<Gate[] | null> {
    try {
      const [[, gatesData], [, timestampData]] = await AsyncStorage.multiGet([
        GATES_CACHE_KEY,
        CACHE_TIMESTAMP_KEY,
      ]);

      if (!gatesData || !timestampData) {
        return null;
      }

      const timestamp = parseInt(timestampData, 10);
      const now = Date.now();

      // Check if cache is expired
      if (now - timestamp > CACHE_DURATION) {
        return null;
      }

      return JSON.parse(gatesData);
    } catch (error) {
      console.error("Failed to get gates from cache:", error);
      return null;
    }
  }

  /**
   * Clear gates cache
   */
  async clearGates(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([GATES_CACHE_KEY, CACHE_TIMESTAMP_KEY]);
    } catch (error) {
      console.error("Failed to clear gates cache:", error);
    }
  }

  /**
   * Get cache timestamp
   * @returns Timestamp in milliseconds or null
   */
  async getCacheTimestamp(): Promise<number | null> {
    try {
      const timestampData = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      return timestampData ? parseInt(timestampData, 10) : null;
    } catch (error) {
      console.error("Failed to get cache timestamp:", error);
      return null;
    }
  }

  /**
   * Get favorite gate codes from AsyncStorage
   * @returns Array of favorite gate codes
   */
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem("@starseeker:favorites");
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error("Failed to get favorites:", error);
      return [];
    }
  }

  /**
   * Save favorite gate codes to AsyncStorage
   * @param favorites - Array of gate codes
   */
  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@starseeker:favorites",
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }

  /**
   * Toggle favorite status for a gate
   * @param gateCode - Gate code to toggle
   * @returns New favorite status
   */
  async toggleFavorite(gateCode: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const index = favorites.indexOf(gateCode);

      if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        await this.saveFavorites(favorites);
        return false;
      } else {
        // Add to favorites
        favorites.push(gateCode);
        await this.saveFavorites(favorites);
        return true;
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      return false;
    }
  }
}

export const cache = new CacheService();
