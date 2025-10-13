import { api } from "@/services/api";
import { cache } from "@/services/cache";
import { Gate } from "@/types/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GatesContextType {
  gates: Gate[];
  loading: boolean;
  error: string | null;
  refreshGates: () => Promise<void>;
}

const GatesContext = createContext<GatesContextType | undefined>(undefined);

export function GatesProvider({ children }: { children: ReactNode }) {
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGates();
  }, []);

  const loadGates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cachedGates = await cache.getGates();
      if (cachedGates) {
        setGates(cachedGates);
        setLoading(false);
        // Still fetch fresh data in background
        fetchAndCacheGates();
        return;
      }

      // No cache - fetch from API
      await fetchAndCacheGates();
    } catch (err) {
      setError("Failed to load gates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndCacheGates = async () => {
    const data = await api.getGates();
    setGates(data);
    await cache.saveGates(data);
  };

  const refreshGates = async () => {
    await loadGates();
  };

  return (
    <GatesContext.Provider value={{ gates, loading, error, refreshGates }}>
      {children}
    </GatesContext.Provider>
  );
}

export function useGates() {
  const context = useContext(GatesContext);
  if (context === undefined) {
    throw new Error("useGates must be used within a GatesProvider");
  }
  return context;
}
