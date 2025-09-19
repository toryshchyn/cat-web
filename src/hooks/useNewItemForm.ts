import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ItemApiService } from "../services/item-api-service";
import { useItemFormBase } from "./useItemFormBase";
import { ItemFormValues } from "../components/ItemForm";

export function useNewItemForm() {
  const navigate = useNavigate();
  const form = useItemFormBase();

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
          container_id: data.container_id,
          tags: [],
          image_id: null,
        });
      }
    } catch {
      toast.error("Failed to create item");
    }
  };

  return { form, loading: false, saveItem };
}
