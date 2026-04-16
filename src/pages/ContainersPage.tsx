import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ContainerApiService, ContainerWithCount } from "../services/container-api-service";
import { ItemApiService } from "../services/item-api-service";

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragSourceId, setDragSourceId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);

  const loadContainers = async () => {
    setLoading(true);
    try {
      const data = await ContainerApiService.getContainersWithCounts();
      setContainers(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      toast.error("Failed to load containers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContainers();
  }, []);

  const startEdit = (container: ContainerWithCount) => {
    setEditingId(container.id);
    setEditingName(container.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: number) => {
    const nextName = editingName.trim();
    if (!nextName) {
      toast.error("Container name is required");
      return;
    }
    setSaving(true);
    try {
      const updated = await ContainerApiService.updateContainer(id, {
        name: nextName,
      });
      setContainers((prev) =>
        prev
          .map((c) =>
            c.id === id
              ? { ...c, name: updated.name }
              : c
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success("Container updated");
      cancelEdit();
    } catch {
      toast.error("Failed to update container");
    } finally {
      setSaving(false);
    }
  };

  const deleteContainer = async (id: number) => {
    setSaving(true);
    try {
      await ContainerApiService.deleteContainer(id);
      setContainers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Container deleted");
      if (editingId === id) {
        cancelEdit();
      }
    } catch {
      toast.error("Failed to delete container");
    } finally {
      setSaving(false);
    }
  };

  const moveItems = async (fromContainerId: number, toContainerId: number) => {
    if (fromContainerId === toContainerId) {
      return;
    }
    setSaving(true);
    try {
      const items = await ItemApiService.getItemsByContainer(fromContainerId);
      if (!items.length) {
        toast.info("No items to move");
        return;
      }
      for (const item of items) {
        await ItemApiService.updateItem(item.id, { container_id: toContainerId });
      }
      await loadContainers();
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
        Containers
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
              {containers.map((container) => {
                const isEditing = editingId === container.id;
                return (
                  <TableRow
                    key={container.id}
                    hover
                    onDragOver={(e) => {
                      if (dragSourceId !== null && dragSourceId !== container.id) {
                        e.preventDefault();
                        setDropTargetId(container.id);
                      }
                    }}
                    onDragLeave={() => {
                      if (dropTargetId === container.id) {
                        setDropTargetId(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const raw = e.dataTransfer.getData("text/container-source-id");
                      const fromId = Number(raw);
                      if (Number.isFinite(fromId) && fromId > 0 && fromId !== container.id) {
                        void moveItems(fromId, container.id);
                      } else {
                        setDropTargetId(null);
                      }
                    }}
                    sx={
                      dropTargetId === container.id
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
                        <MuiLink
                          component={Link}
                          to={`/container/${container.id}`}
                          underline="hover"
                        >
                          {container.name}
                        </MuiLink>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        draggable={container.count > 0 && !saving}
                        onDragStart={(e) => {
                          if (container.count <= 0 || saving) {
                            e.preventDefault();
                            return;
                          }
                          e.dataTransfer.setData(
                            "text/container-source-id",
                            String(container.id)
                          );
                          e.dataTransfer.effectAllowed = "move";
                          setDragSourceId(container.id);
                        }}
                        onDragEnd={() => {
                          setDragSourceId(null);
                          setDropTargetId(null);
                        }}
                        sx={{
                          cursor: container.count > 0 && !saving ? "grab" : "default",
                          userSelect: "none",
                          fontWeight: dragSourceId === container.id ? 700 : 400,
                        }}
                        title={
                          container.count > 0
                            ? "Drag this count to another container to move linked items"
                            : undefined
                        }
                      >
                        {container.count}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      {isEditing ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => void saveEdit(container.id)}
                            disabled={saving}
                            aria-label="save container"
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={cancelEdit}
                            disabled={saving}
                            aria-label="cancel container edit"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => startEdit(container)}
                            aria-label="edit container"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {container.count === 0 && (
                            <IconButton
                              size="small"
                              onClick={() => void deleteContainer(container.id)}
                              aria-label="delete container"
                              disabled={saving}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {containers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No containers found.</Typography>
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
