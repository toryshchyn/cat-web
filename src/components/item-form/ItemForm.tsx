import React from "react";
import { Button, Card, CardContent, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { ContainerAutocomplete } from "./ContainerAutocomplete";
import { TagAutocomplete } from "./TagAutocomplete";
import ImageUpload from "./ImageUpload";
import { UploadResponse } from "../../services/image-api-service";
import { useNavigate } from "react-router-dom";
import { ItemApiService } from "../../services/item-api-service";

export type ItemFormValues = {
  name: string;
  description?: string | null;
  container_id: number;
  /** Typed container label for resolving/creating a container when `container_id` is not set yet */
  container_input?: string;
  /** Comma-separated tags typed by user (used for create-on-save flow). */
  tags_input?: string;
  tags: number[];
  image_id?: number | null;
}

type Props = {
  form: UseFormReturn<ItemFormValues>;
  onSubmit: (data: ItemFormValues, closeAfter: boolean) => Promise<void>;
  loading: boolean;
  initialImageId?: number | null;
  initialImageUrl?: string | null;
  mode: "new" | "edit";
  autocompleteRefreshKey?: number;
};

const ItemForm: React.FC<Props> = ({
  form,
  onSubmit,
  mode,
  initialImageUrl,
  autocompleteRefreshKey = 0,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <FormProvider {...form}>
        <form onSubmit={handleSubmit((data) => onSubmit(data, true))}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                fullWidth
                {...register("name", {
                  required: "Name is required",
                  maxLength: { value: 255, message: "Max 255 chars" },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ContainerAutocomplete
                key={`container-autocomplete-${autocompleteRefreshKey}`}
                name="container_id"
                control={control}
                disabled={isSubmitting}
                rules={{
                  validate: (_v, values) => {
                    const id = values.container_id;
                    const typed = (values.container_input ?? "").trim();
                    if (typeof id === "number" && id > 0) {
                      return true;
                    }
                    if (typed.length > 0) {
                      return true;
                    }
                    return "Container is required";
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                minRows={3}
                {...register("description")}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TagAutocomplete
                key={`tag-autocomplete-${autocompleteRefreshKey}`}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }} display="flex" justifyContent="center">
              <ImageUpload
                uploader={async (file: File): Promise<UploadResponse> => {
                  const response = await import("../../services/image-api-service").then(
                    (m) => m.ImageApiService.uploadImage(file)
                  );
                  return response;
                }}
                onUploaded={(id: number) =>
                  reset((prev) => ({ ...prev, image_id: id }))
                }
                onRemoved={() =>
                  reset((prev) => ({ ...prev, image_id: null }))
                }
                disabled={isSubmitting}
                initialImageId={form.watch("image_id")}
                initialImageUrl={initialImageUrl}
                getAccessToken={ItemApiService.accessTokenProvider}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Save and close"}
                </Button>
                {mode === "new" && (
                  <Button
                    variant="outlined"
                    onClick={handleSubmit((data) => onSubmit(data, false))}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Save and add next"}
                  </Button>
                )}
                <Button
                  color="error"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
        </FormProvider>
      </CardContent>
    </Card >
  );
};

export default ItemForm;
