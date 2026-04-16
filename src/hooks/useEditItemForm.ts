import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { ItemFormValues } from "../components/item-form/ItemForm";
import { useItemFormBase } from "./useItemFormBase";
import { resolveContainerIdForItem } from "../utils/resolve-container-for-item";
import { resolveTagIdsForItem } from "../utils/resolve-tags-for-item";

export function useEditItemForm() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);

  const form = useItemFormBase();

  useEffect(() => {
    if (!itemId) {
      return;
    }
    setLoading(true);
    ItemApiService.getItemById(Number(itemId))
      .then((item: ItemRow) => {
        form.reset({
          ...item,
          tags: item.tags ?? [],
          container_input: "",
          tags_input: "",
        });
        setInitialImageUrl(item.imageUrl ?? null);
      })
      .finally(() => setLoading(false));
  }, [itemId, form]);

  const updateItem = async (data: ItemFormValues, closeAfter: boolean) => {
    if (!itemId) {
      return;
    }
    try {
      const container_id = await resolveContainerIdForItem(data);
      const tags = await resolveTagIdsForItem(data);
      const { container_input: _ci, tags_input: _ti, ...rest } = data;
      await ItemApiService.updateItem(Number(itemId), {
        ...rest,
        container_id,
        tags,
      });
      toast.success("Item updated successfully");
      if (closeAfter) {
        navigate("/dashboard");
      } else {
        form.reset({ ...data, container_id, container_input: "", tags_input: "" });
      }
    } catch {
      toast.error("Failed to update item");
    }
  };

  return { form, loading, updateItem, initialImageUrl };
}
