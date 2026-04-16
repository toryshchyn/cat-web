import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { TagApiService, TagWithCount } from "../services/tag-api-service";
import { ItemApiService } from "../services/item-api-service";

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragSourceId, setDragSourceId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await TagApiService.getTagsWithCounts();
      setTags(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTags();
  }, []);

  const startEdit = (tag: TagWithCount) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: number) => {
    const nextName = editingName.trim();
    if (!nextName) {
      toast.error("Tag name is required");
      return;
    }
    setSaving(true);
    try {
      const updated = await TagApiService.updateTag(id, { name: nextName });
      setTags((prev) =>
        prev
          .map((t) => (t.id === id ? { ...t, name: updated.name } : t))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success("Tag updated");
      cancelEdit();
    } catch {
      toast.error("Failed to update tag");
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (id: number) => {
    setSaving(true);
    try {
      await TagApiService.deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tag deleted");
      if (editingId === id) {
        cancelEdit();
      }
    } catch {
      toast.error("Failed to delete tag");
    } finally {
      setSaving(false);
    }
  };

  const moveItems = async (fromTagId: number, toTagId: number) => {
    if (fromTagId === toTagId) {
      return;
    }
    setSaving(true);
    try {
      const items = await ItemApiService.getItemsByTag(fromTagId);
      if (!items.length) {
        toast.info("No items to move");
        return;
      }
      for (const item of items) {
        const fullItem = await ItemApiService.getItemById(item.id);
        const currentTags = fullItem.tags ?? item.tags ?? [];
        const nextTags = Array.from(
          new Set(currentTags.filter((t) => t !== fromTagId).concat(toTagId))
        );
        await ItemApiService.updateItem(item.id, { tags: nextTags });
      }
      await loadTags();
      toast.success(`Moved ${items.length} item(s)`);
    } catch {
      toast.error("Failed to move items");
    } finally {
      setSaving(false);
      setDragSourceId(null);
      setDropTargetId(null);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tags
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Items</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => {
                const isEditing = editingId === tag.id;
                return (
                  <TableRow
                    key={tag.id}
                    hover
                    onDragOver={(e) => {
                      if (dragSourceId !== null && dragSourceId !== tag.id) {
                        e.preventDefault();
                        setDropTargetId(tag.id);
                      }
                    }}
                    onDragLeave={() => {
                      if (dropTargetId === tag.id) {
                        setDropTargetId(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const raw = e.dataTransfer.getData("text/tag-source-id");
                      const fromId = Number(raw);
                      if (Number.isFinite(fromId) && fromId > 0 && fromId !== tag.id) {
                        void moveItems(fromId, tag.id);
                      } else {
                        setDropTargetId(null);
                      }
                    }}
                    sx={
                      dropTargetId === tag.id
                        ? { backgroundColor: "action.hover" }
                        : undefined
                    }
                  >
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          size="small"
                          fullWidth
                          disabled={saving}
                          autoFocus
                        />
                      ) : (
                        <MuiLink component={Link} to={`/tag/${tag.id}`} underline="hover">
                          {tag.name}
                        </MuiLink>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        draggable={tag.count > 0 && !saving}
                        onDragStart={(e) => {
                          if (tag.count <= 0 || saving) {
                            e.preventDefault();
                            return;
                          }
                          e.dataTransfer.setData("text/tag-source-id", String(tag.id));
                          e.dataTransfer.effectAllowed = "move";
                          setDragSourceId(tag.id);
                        }}
                        onDragEnd={() => {
                          setDragSourceId(null);
                          setDropTargetId(null);
                        }}
                        sx={{
                          cursor: tag.count > 0 && !saving ? "grab" : "default",
                          userSelect: "none",
                          fontWeight: dragSourceId === tag.id ? 700 : 400,
                        }}
                        title={
                          tag.count > 0
                            ? "Drag this count to another tag to move linked items"
                            : undefined
                        }
                      >
                        {tag.count}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      {isEditing ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => void saveEdit(tag.id)}
                            disabled={saving}
                            aria-label="save tag"
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={cancelEdit}
                            disabled={saving}
                            aria-label="cancel tag edit"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton size="small" onClick={() => startEdit(tag)} aria-label="edit tag">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => void deleteTag(tag.id)}
                            aria-label="delete tag"
                            disabled={saving}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {tags.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No tags found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
