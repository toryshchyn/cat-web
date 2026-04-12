import { useEffect, useState } from "react";
import { TagApiService, TagWithCount } from "../services/tag-api-service";

export function useTagsWithCounts() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchTags = async () => {
      try {
        setLoading(true);
        const data = await TagApiService.getTagsWithCounts();
        if (!signal.aborted) {
          setTags(data);
        }
      } catch {
        if (!signal.aborted) {
          setError("Failed to load tags");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTags();

    return () => controller.abort();
  }, []);

  return { tags, loading, error };
}
