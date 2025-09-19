import { useEffect, useState } from "react";

export function useProtectedImage(url?: string, getAccessToken?: () => Promise<string>) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !getAccessToken) {
      return;
    }

    const controller = new AbortController();
    const load = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load image");
        }

        const blob = await response.blob();
        const objUrl = URL.createObjectURL(blob);
        setObjectUrl(objUrl);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      }
    };

    load();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, getAccessToken]);

  return objectUrl;
}
