import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ItemApi, CreateItemRequest } from '../services/items';
import { ImageApi } from '../services/images';
import { useAuth0 } from '@auth0/auth0-react';

export type FormValues = {
  name: string;
  description?: string | null;
  container_id: number | null;
  tags: number[];
};

export function useNewItemForm() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [lastContainerId, setLastContainerId] = useState<number | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { name: '', description: '', container_id: lastContainerId, tags: [] },
    mode: 'onBlur',
  });

  const buildItemData = (): CreateItemRequest => {
    const v = form.getValues();
    if (!v.container_id) {
      throw new Error('Container is required');
    }
    return {
      name: v.name.trim(),
      description: v.description?.trim() || null,
      container_id: v.container_id,
      image_id: imageId,
      tags: v.tags,
    };
  };

  const saveItem = async (closeAfterSave = true) => {
    try {
      setSaving(true);
      const itemData = buildItemData();
      await ItemApi.createItem(itemData);

      if (closeAfterSave) {
        toast.success('Item added successfully');
        navigate('/dashboard');
      } else {
        const keepContainer = form.getValues('container_id');
        setLastContainerId(keepContainer);
        form.reset({
          name: '',
          description: '',
          container_id: keepContainer,
          tags: []
        });
        setImageId(null);
        toast.success('Item added successfully');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save item';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    return ImageApi.uploadImage(file, () =>
      getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
    );
  };

  return {
    form,
    saving,
    setSaving,
    imageId,
    setImageId,
    saveItem,
    uploadImage
  };
}
