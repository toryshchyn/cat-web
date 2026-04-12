import React, { useEffect, useState } from "react";
import { Container, Typography, IconButton, CircularProgress, Box, Card, CardContent, Divider, Stack, Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { ContainerApiService } from "../services/container-api-service";
import { ImageDisplay } from "../components/ImageDisplay";

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const [itemData, containers] = await Promise.all([
          ItemApiService.getItemById(Number(id)),
          ContainerApiService.getContainers(),
        ]);

        if (signal.aborted) {
          return;
        }

        const container = containers.find(c => c.id === itemData.container_id);

        setItem({
          ...itemData,
          containerName: container?.name ?? "Unknown",
        });
      } catch {
        if (!signal.aborted) {
          setError("Failed to load item");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItem();
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await ItemApiService.deleteItem(Number(id));
    navigate("/dashboard");
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {item ? item.name : "Item"}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !item ? (
        <Typography color="error">Item not found</Typography>
      ) : (
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" gutterBottom>
                  {item.name}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Container
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/container/${item.container_id}`}
                    endIcon={<ArrowForwardIosIcon />}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    {item.containerName} (#{item.container_id})
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.description || "—"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/edit-item/${item.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>

              {item.image_id && (
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ImageDisplay
                    imageId={item.image_id}
                    alt={item.name}
                    width="100%"
                    height="auto"
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ItemDetailsPage;
