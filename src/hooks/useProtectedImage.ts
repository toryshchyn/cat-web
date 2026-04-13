import { useEffect, useRef, useState } from "react";

/**
 * Loads a protected image URL into an object URL.
 * The token getter is kept in a ref so callers can pass inline lambdas
 * without retriggering the effect on every render (which would loop fetches).
 */
export function useProtectedImage(url?: string, getAccessToken?: () => Promise<string>) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const getTokenRef = useRef(getAccessToken);
  getTokenRef.current = getAccessToken;
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    const revokeBlob = () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };

    if (!url) {
      revokeBlob();
      setObjectUrl(null);
      return;
    }

    const controller = new AbortController();
    revokeBlob();
    setObjectUrl(null);

    (async () => {
      const getToken = getTokenRef.current;
      if (!getToken) {
        return;
      }

      try {
        const token = await getToken();
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (!response.ok) {
          return;
        }

        const blob = await response.blob();
        if (controller.signal.aborted) {
          return;
        }

        const next = URL.createObjectURL(blob);
        if (controller.signal.aborted) {
          URL.revokeObjectURL(next);
          return;
        }

        blobRef.current = next;
        setObjectUrl(next);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      }
    })();

    return () => {
      controller.abort();
      revokeBlob();
    };
  }, [url]);

  return objectUrl;
}
