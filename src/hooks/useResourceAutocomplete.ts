import { useEffect, useState, useCallback } from 'react';

export function useResourceAutocomplete<T extends { id: number; name: string }>(
  fetchAll: () => Promise<T[]>,
  createOne: (data: { name: string }) => Promise<T | null>
) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAll();
      setOptions(list);
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  const addOne = async (name: string): Promise<T | null> => {
    const created = await createOne({ name });
    if (created) {
      setOptions(prev =>
        prev.some(o => o.id === created.id) ? prev : [created, ...prev]
      );
      return created;
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await fetchAll();
        setOptions(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { options, loading, addOne, refresh };
}

