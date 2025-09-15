async function resolveString<T extends { id: number; name: string }>(
  name: string,
  options: T[],
  addOne?: (name: string) => Promise<T | null>
): Promise<number | null> {
  const existing = options.find(
    (o) => o.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) return existing.id;

  if (addOne) {
    try {
      const created = await addOne(name);
      return created?.id ?? null;
    } catch (err) {
      console.error('Failed to create resource', err);
    }
  }
  return null;
}

export async function mapValuesToIds<T extends { id: number; name: string }>(
  values: (string | T | null)[],
  options: T[],
  addOne?: (name: string) => Promise<T | null>
): Promise<number[]> {
  const ids: number[] = [];

  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string') {
      const id = await resolveString<T>(v.trim(), options, addOne);
      if (id) ids.push(id);
    } else {
      ids.push(v.id);
    }
  }

  return ids;
}
