import type { ContainerRow } from "./container-api-service";
import type { ItemRow } from "./item-api-service";

/** Resolves `containerName` once from a shared containers list (no per-item network). */
export function withContainerNames(items: ItemRow[], containers: ContainerRow[]): ItemRow[] {
  const nameById = new Map(containers.map((c) => [c.id, c.name]));
  return items.map((item) => ({
    ...item,
    containerName: nameById.get(item.container_id) ?? "Unknown",
  }));
}
