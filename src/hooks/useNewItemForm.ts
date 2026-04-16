import { useNavigate } from "react-router-dom";
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
  const form = useItemFormBase({
    tags: defaults.tagId ? [defaults.tagId] : [],
    container_id: defaults.containerId ?? 0,
  });

  const saveItem = async (data: ItemFormValues, closeAfter: boolean) => {
    try {
      const container_id = await resolveContainerIdForItem(data);
      const tags = await resolveTagIdsForItem(data);
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

  return { form, loading: false, saveItem };
}
