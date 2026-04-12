import { useForm } from "react-hook-form";
import { ItemFormValues } from "../components/ItemForm";

export function useItemFormBase(defaultValues?: Partial<ItemFormValues>) {
  const form = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      description: null,
      container_id: 0,
      tags: [],
      image_id: null,
      ...defaultValues,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return form;
}
