import { useEffect, useState } from 'react';

export function useResourceAutocomplete<T extends { id: number; name: string }>(
  fetchAll: () => Promise<T[]>,
  createOne: (data: { name: string }) => Promise<T | null>
) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const addOne = async (name: string): Promise<T | null> => {
    try {
      const created = await createOne({ name });
      if (created) {
        setOptions(prev => {
          if (prev.some(o => o.id === created.id)) {
            return prev;
          }
          return [created, ...prev];
        });
        return created;
      }
    } catch (e) {
      console.error('Create failed', e);
    }
    return null;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const list = await fetchAll();
        if (mounted) {
          setOptions(list);
        }
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  return { options, loading, addOne };
}
