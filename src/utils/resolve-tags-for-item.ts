import { TagApiService } from "../services/tag-api-service";

type TagFieldShape = {
  tags?: number[];
  tags_input?: string;
};

function parseTagNames(csv: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of csv.split(",")) {
    const name = raw.trim();
    if (!name) {
      continue;
    }
    const key = name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(name);
  }
  return result;
}

export async function resolveTagIdsForItem(data: TagFieldShape): Promise<number[]> {
  const csv = (data.tags_input ?? "").trim();
  if (!csv) {
    return data.tags ?? [];
  }

  const names = parseTagNames(csv);
  if (!names.length) {
    return [];
  }

  let all = await TagApiService.getTags();
  const ids: number[] = [];

  for (const name of names) {
    const existing = all.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      ids.push(existing.id);
      continue;
    }
    const created = await TagApiService.createTag({ name });
    if (!created) {
      throw new Error(`Failed to create tag: ${name}`);
    }
    ids.push(created.id);
    all = [created, ...all];
  }

  return ids;
}
