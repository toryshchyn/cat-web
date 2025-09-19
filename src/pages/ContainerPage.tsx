import { Container, Typography, IconButton, Fab, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ItemGrid from "../components/ItemGrid";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { ContainerApiService, ContainerRow } from "../services/container-api-service";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ContainerPage: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [container, setContainer] = useState<ContainerRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [containerData, itemsData] = await Promise.all([
          ContainerApiService.getContainerById(Number(containerId)),
          ItemApiService.getItemsByContainer(Number(containerId)),
        ]);

        if (signal.aborted) {
          return;
        }

        setContainer(containerData);
        setItems(itemsData);
      } catch {
        if (!signal.aborted) {
          setError("Failed to load container or items");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [containerId]);

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {container ? `Container: ${container.name}` : "Container"}
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
        onClick={() => navigate("/new-item")}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ContainerPage;
