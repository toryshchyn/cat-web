import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { ItemFormValues } from "../components/ItemForm";
import { useItemFormBase } from "./useItemFormBase";

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
        form.reset(item);
        setInitialImageUrl(item.imageUrl ?? null);
      })
      .finally(() => setLoading(false));
  }, [itemId, form]);

  const updateItem = async (data: ItemFormValues, closeAfter: boolean) => {
    if (!itemId) {
      return;
    }
    try {
      await ItemApiService.updateItem(Number(itemId), { ...data, tags: data.tags ?? [] });
      toast.success("Item updated successfully");
      if (closeAfter) {
        navigate("/dashboard");
      } else {
        form.reset(data);
      }
    } catch {
      toast.error("Failed to update item");
    }
  };

  return { form, loading, updateItem, initialImageUrl };
}
