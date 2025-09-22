import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ItemApiService } from "../services/item-api-service";
import { useItemFormBase } from "./useItemFormBase";
import { ItemFormValues } from "../components/ItemForm";

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
      await ItemApiService.createItem({ ...data, tags: data.tags ?? [] });
      toast.success("Item created successfully");
      if (closeAfter) {
        navigate("/dashboard");
      } else {
        form.reset({
          name: "",
          description: null,
          container_id: defaults.containerId ?? data.container_id,
          tags: defaults.tagId ? [defaults.tagId] : [],
          image_id: null,
        });
      }
    } catch {
      toast.error("Failed to create item");
    }
  };

  return { form, loading: false, saveItem };
}
