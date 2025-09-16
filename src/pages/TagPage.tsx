import { Container, Typography, IconButton, Fab, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ItemGrid from "../components/ItemGrid";
import { ItemApi, ItemRow } from "../services/items";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TagPage: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tagId) {
      return;
    }

    setLoading(true);
    setError(null);

    ItemApi.getItemsByTag(Number(tagId))
      .then(setItems)
      .catch(() => setError("Failed to load items"))
      .finally(() => setLoading(false));
  }, [tagId]);

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate("/dashboard")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Tag: {tagId}
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

export default TagPage;
