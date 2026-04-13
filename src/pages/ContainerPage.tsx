import { Typography, IconButton, Fab, CircularProgress, Box, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ItemGrid from "../components/shared/ItemGrid";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import { ContainerApiService, ContainerRow } from "../services/container-api-service";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ContainerPage: React.FC = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [container, setContainer] = useState<ContainerRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box sx={{ py: 2 }}>
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
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap: 1 }}>
            <ToggleButtonGroup
              exclusive
              value={viewMode}
              onChange={(_, next) => next && setViewMode(next)}
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewOutlinedIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListOutlinedIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
            {isMobile && viewMode === "grid" && (
              <ToggleButtonGroup
                exclusive
                value={mobileColumns}
                onChange={(_, next) => next && setMobileColumns(next)}
                size="small"
              >
                <ToggleButton value={1} aria-label="one item per row">
                  <ViewAgendaOutlinedIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value={2} aria-label="two items per row">
                  <GridViewOutlinedIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
          <ItemGrid
            items={items}
            viewMode={viewMode}
            mobileColumns={isMobile && viewMode === "grid" ? mobileColumns : 1}
          />
        </>
      )}

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/new-item", { state: { containerId: Number(containerId) } })}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ContainerPage;
