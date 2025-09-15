import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import { ApiService, CreateItemRequest } from '../services/api-service';
import { ContainerAutocomplete } from '../components/ContainerAutocomplete';
import { TagAutocomplete } from '../components/TagAutocomplete';

type FormValues = {
  name: string;
  description?: string | null;
  container_id: number | null;
  tags: number[];
};

const NewItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [saving, setSaving] = useState(false);
  const [lastContainerId, setLastContainerId] = useState<number | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);

  const {
    control,
    register,
    formState: { errors },
    reset,
    getValues
  } = useForm<FormValues>({
    defaultValues: { name: '', description: '', container_id: lastContainerId, tags: [] },
    mode: 'onBlur',
  });

  const buildPayload = (): CreateItemRequest => {
    const v = getValues();
    if (!v.container_id) throw new Error('Container is required');
    return {
      name: v.name.trim(),
      description: v.description?.trim() || null,
      container_id: v.container_id,
      image_id: imageId,
      tags: v.tags,
    };
  };

  const onSaveAndClose = async () => {
    try {
      setSaving(true);
      const payload = await buildPayload();
      console.log("Payload перед відправкою:", payload);
      await ApiService.createItem(payload);
      toast.success('Item added successfully');
      navigate('/dashboard');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save item';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const onSaveAndNext = async () => {
    try {
      setSaving(true);
      const payload = await buildPayload();
      console.log("Payload перед відправкою:", payload); // ✅
      await ApiService.createItem(payload);
      const keepContainer = getValues('container_id');
      setLastContainerId(keepContainer);
      reset({ name: '', description: '', container_id: keepContainer, tags: [] });
      setImageId(null);
      toast.success('Item added successfully');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save item';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => navigate(-1);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>New item</Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ContainerAutocomplete<FormValues>
                control={control}
                name="container_id"
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                fullWidth
                {...register('name', {
                  required: 'Name is required',
                  maxLength: { value: 255, message: 'Max 255 chars' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                {...register('description')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TagAutocomplete<FormValues>
                control={control}
                name="tags"
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'center'}>
              <ImageUpload
                uploader={(file) =>
                  ApiService.uploadImage(file, () =>
                    getAccessTokenSilently({
                      authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                      },
                    })
                  )
                }
                onUploaded={(id) => setImageId(id)}
                onRemoved={() => setImageId(null)}
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  onClick={onSaveAndClose}
                  disabled={saving}
                >
                  Save and close
                </Button>
                <Button
                  variant="outlined"
                  onClick={onSaveAndNext}
                  disabled={saving}
                >
                  Save and add next
                </Button>
                <Button color="error" onClick={onCancel} disabled={saving}>
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>

          { }
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewItemPage;