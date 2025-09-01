import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

/**
 * Custom React hook for handling Appwrite API calls with loading states and error handling
 * 
 * This hook provides a standardized way to interact with Appwrite backend services,
 * automatically managing loading states, error handling, and data fetching lifecycle.
 * 
 * @template T - The expected return type of the API call
 * @template P - The parameters object type (must extend Record<string, string | number>)
 * 
 * @param fn - The async function that makes the Appwrite API call
 * @param params - Optional parameters to pass to the API function
 * @param skip - If true, skips the initial API call on mount
 * 
 * @returns Object containing:
 *   - data: The fetched data (null if not loaded or error occurred)
 *   - loading: Boolean indicating if a request is in progress
 *   - error: Error message string (null if no error)
 *   - refetch: Function to manually trigger a new API call with updated parameters
 * 
 * @example
 * ```tsx
 * const { data: posts, loading, error, refetch } = useAppwrite({
 *   fn: getAllPosts,
 *   params: { limit: 10, offset: 0 }
 * });
 * ```
 */
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};