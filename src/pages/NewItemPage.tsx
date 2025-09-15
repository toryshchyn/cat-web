import React from 'react';
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ImageUpload from '../components/ImageUpload';
import { ContainerAutocomplete } from '../components/ContainerAutocomplete';
import { TagAutocomplete } from '../components/TagAutocomplete';
import { useNewItemForm } from '../hooks/useNewItemForm';

const NewItemPage: React.FC = () => {
  const {
    form,
    saving,
    setImageId,
    saveItem,
    uploadImage
  } = useNewItemForm();

  const {
    control,
    register,
    formState: { errors }
  } = form;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>New item</Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ContainerAutocomplete
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
                {...register('description', {
                  required: 'Description is required',
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TagAutocomplete
                control={control}
                name="tags"
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12 }} display="flex" justifyContent="center">
              <ImageUpload
                uploader={uploadImage}
                onUploaded={setImageId}
                onRemoved={() => setImageId(null)}
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  onClick={() => saveItem(true)}
                  disabled={saving}
                >
                  Save and close
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => saveItem(false)}
                  disabled={saving}
                >
                  Save and add next
                </Button>
                <Button color="error" onClick={() => history.back()} disabled={saving}>
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container >
  );
};

export default NewItemPage;
