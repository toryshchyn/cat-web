import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Typography, } from "@mui/material";
import ViewToggle from "../components/ViewToggle";
import TagList from "../components/TagList";
import { useNavigate } from "react-router-dom";
import { TagApi, TagRow } from "../services/tags";

const TagsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"cloud" | "list">("cloud");
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    TagApi.getTags()
      .then(setTags)
      .catch(() => setError("Failed to load tags"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ py: 2 }}>

      <ViewToggle mode={viewMode} onChange={setViewMode} />

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : tags.length === 0 ? (
          <Typography color="text.secondary">No tags found.</Typography>
        ) : viewMode === "cloud" ? (
          <Typography color="text.secondary">...</Typography>
        ) : (
          <TagList
            tags={tags}
            onSelect={(id) => navigate(`/tag/${id}`)}
          />
        )}
      </Box>
    </Container>
  );
};

export default TagsPage;
