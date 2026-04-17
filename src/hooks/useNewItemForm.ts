import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { ItemApiService } from "../services/item-api-service";
import { useItemFormBase } from "./useItemFormBase";
import { ItemFormValues } from "../components/item-form/ItemForm";
import { resolveContainerIdForItem } from "../utils/resolve-container-for-item";
import { resolveTagIdsForItem } from "../utils/resolve-tags-for-item";

type Defaults = {
  tagId?: number;
  containerId?: number;
};

export function useNewItemForm(defaults: Defaults = {}) {
  const navigate = useNavigate();
  const [autocompleteRefreshKey, setAutocompleteRefreshKey] = useState(0);
  const form = useItemFormBase({
    tags: defaults.tagId ? [defaults.tagId] : [],
    container_id: defaults.containerId ?? 0,
  });

  const saveItem = async (data: ItemFormValues, closeAfter: boolean) => {
    try {
      const containerResult = await resolveContainerIdForItem(data);
      const tagResult = await resolveTagIdsForItem(data);
      const container_id = containerResult.containerId;
      const tags = tagResult.tagIds;
      const { container_input: _ci, tags_input: _ti, ...rest } = data;
      await ItemApiService.createItem({
        ...rest,
        container_id,
        tags,
      });
      toast.success("Item created successfully");
      if (closeAfter) {
        navigate("/dashboard");
      } else {
        if (containerResult.created || tagResult.createdCount > 0) {
          setAutocompleteRefreshKey((prev) => prev + 1);
        }
        form.reset({
          name: "",
          description: null,
          container_id: defaults.containerId ?? container_id,
          container_input: "",
          tags: defaults.tagId ? [defaults.tagId] : [],
          tags_input: "",
          image_id: null,
        });
      }
    } catch {
      toast.error("Failed to create item");
    }
  };

  return { form, loading: false, saveItem, autocompleteRefreshKey };
}
