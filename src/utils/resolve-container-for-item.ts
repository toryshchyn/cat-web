import { ContainerApiService } from "../services/container-api-service";

export type ContainerFieldShape = {
  container_id: number;
  container_input?: string;
};

/**
 * Ensures a real `container_id` when the user typed a new name (or only `container_input` is set).
 */
export async function resolveContainerIdForItem(
  data: ContainerFieldShape
): Promise<number> {
  if (typeof data.container_id === "number" && data.container_id > 0) {
    return data.container_id;
  }
  const raw = (data.container_input ?? "").trim();
  if (!raw) {
    throw new Error("Container is required");
  }
  const existing = await ContainerApiService.getContainerByName(raw);
  if (existing) {
    return existing.id;
  }
  const created = await ContainerApiService.createContainer({ name: raw });
  if (!created) {
    throw new Error("Failed to create container");
  }
  return created.id;
}
