import { Container, Typography, IconButton, Fab, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ItemGrid from "../components/ItemGrid";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { TagApiService, TagRow } from "../services/tag-api-service";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContainerApiService } from "../services/container-api-service";

const TagPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const [tag, setTag] = useState<TagRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tagId) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [tagData, itemsData, containers] = await Promise.all([
          TagApiService.getTagById(Number(tagId)),
          ItemApiService.getItemsByTag(Number(tagId)),
          ContainerApiService.getContainers(),
        ]);

        if (signal.aborted) {
          return;
        }

        setTag(tagData);

        const itemsWithContainerName = itemsData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          container_id: item.container_id,
          image_id: item.image_id,
          tags: item.tags,
          imageUrl: item.imageUrl,
          containerName:
            containers.find(c => c.id === item.container_id)?.name ?? "Unknown",
        }));

        setItems(itemsWithContainerName);
      } catch {
        if (!signal.aborted) {
          setError("Failed to load tag or items");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [tagId]);

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {tag ? `Tag: ${tag.name}` : "Tag"}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ItemGrid items={items} />
      )}

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/new-item", { state: { tagId: Number(tagId) } })}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default TagPage;
