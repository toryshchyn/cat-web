import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import ViewToggle from "../components/dashboard/ViewToggle";
import TagList from "../components/dashboard/TagList";
import TagCloud from "../components/dashboard/TagCloud";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTagsWithCounts } from "../hooks/useTagsWithCounts";
import { ContainerApiService, ContainerWithCount } from "../services/container-api-service";
import { ItemApiService, ItemRow } from "../services/item-api-service";
import ItemGrid from "../components/shared/ItemGrid";

const SEARCH_DEBOUNCE_MS = 500;

const Dashboard: React.FC = () => {
    const [tagViewMode, setTagViewMode] = useState<"cloud" | "list">("cloud");
    const [containerViewMode, setContainerViewMode] = useState<"cloud" | "list">("cloud");
    const [containers, setContainers] = useState<ContainerWithCount[]>([]);
    const [containersLoading, setContainersLoading] = useState(true);
    const [containersError, setContainersError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ItemRow[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [itemNameSuggestions, setItemNameSuggestions] = useState<string[]>([]);
    const navigate = useNavigate();
    const { tags, loading: tagsLoading, error: tagsError } = useTagsWithCounts();
    const normalizedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        if (!normalizedQuery || normalizedQuery.length < 2) {
            setDebouncedQuery("");
            return;
        }
        const id = window.setTimeout(() => {
            setDebouncedQuery(normalizedQuery);
        }, SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(id);
    }, [normalizedQuery]);

    const searchDebouncing =
        normalizedQuery.length >= 2 && normalizedQuery !== debouncedQuery;

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchContainers = async () => {
            try {
                setContainersLoading(true);
                setContainersError(null);
                const data = await ContainerApiService.getContainersWithCounts();
                if (!signal.aborted) {
                    setContainers(data);
                }
            } catch {
                if (!signal.aborted) {
                    setContainersError("Failed to load containers");
                }
            } finally {
                if (!signal.aborted) {
                    setContainersLoading(false);
                }
            }
        };

        fetchContainers();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setSearchResults([]);
            setSearchError(null);
            setSearchLoading(false);
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        const fetchMatches = async () => {
            try {
                setSearchLoading(true);
                setSearchError(null);
                const data = await ItemApiService.searchItemsByText(debouncedQuery);

                if (!signal.aborted) {
                    const withContainerName = data.map((item) => ({
                        ...item,
                        containerName:
                            containers.find((c) => c.id === item.container_id)?.name ??
                            item.containerName ??
                            "Unknown",
                    }));
                    setSearchResults(withContainerName);
                }
            } catch {
                if (!signal.aborted) {
                    setSearchError("Failed to search items");
                }
            } finally {
                if (!signal.aborted) {
                    setSearchLoading(false);
                }
            }
        };

        fetchMatches();
        return () => controller.abort();
    }, [debouncedQuery, containers]);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setItemNameSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        const fetchSuggestions = async () => {
            try {
                const data = await ItemApiService.getItemNameSuggestions(debouncedQuery);
                if (!signal.aborted) {
                    const lowerQuery = debouncedQuery.toLowerCase();
                    const tagMatches = tags
                        .map((tag) => tag.name)
                        .filter((name) => name.toLowerCase().includes(lowerQuery));
                    setItemNameSuggestions(Array.from(new Set([...data, ...tagMatches])));
                }
            } catch {
                if (!signal.aborted) {
                    setItemNameSuggestions([]);
                }
            }
        };

        fetchSuggestions();
        return () => controller.abort();
    }, [debouncedQuery, tags]);

    return (
        <Box sx={{ my: 4 }}>
            <Box sx={{ py: 2 }}>
                <Autocomplete
                    freeSolo
                    options={itemNameSuggestions}
                    value={searchQuery}
                    onInputChange={(_, value) => setSearchQuery(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search item by text"
                            placeholder="Type name, description, or tag..."
                            size="small"
                            fullWidth
                        />
                    )}
                    sx={{ mb: 2 }}
                />

                {normalizedQuery && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 0.75 }}>
                            Item matches
                        </Typography>
                        {searchDebouncing || searchLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : searchError ? (
                            <Typography color="error">{searchError}</Typography>
                        ) : searchResults.length === 0 ? (
                            <Typography color="text.secondary">No items found.</Typography>
                        ) : (
                            <ItemGrid items={searchResults} viewMode="list" />
                        )}
                    </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 0.5 }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/tags"
                        sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                    >
                        Tags
                    </Typography>
                    <ViewToggle mode={tagViewMode} onChange={setTagViewMode} />
                </Box>

                <Box sx={{ mt: 0.5 }}>
                    {tagsLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {tagsError && <Typography color="error">{tagsError}</Typography>}

                    {!tagsLoading && !tagsError && tags.length === 0 && (
                        <Typography color="text.secondary">No tags found.</Typography>
                    )}

                    {!tagsLoading && !tagsError && tags.length > 0 && (
                        tagViewMode === "cloud" ? (
                            <TagCloud tags={tags} onSelect={(id) => navigate(`/tag/${id}`)} />
                        ) : (
                            <TagList tags={tags} onSelect={(id) => navigate(`/tag/${id}`)} />
                        )
                    )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 3, mb: 0.5 }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/containers"
                        sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                    >
                        Containers
                    </Typography>
                    <ViewToggle mode={containerViewMode} onChange={setContainerViewMode} />
                </Box>

                <Box sx={{ mt: 0.5 }}>
                    {containersLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {containersError && <Typography color="error">{containersError}</Typography>}

                    {!containersLoading && !containersError && containers.length === 0 && (
                        <Typography color="text.secondary">No containers found.</Typography>
                    )}

                    {!containersLoading && !containersError && containers.length > 0 && (
                        containerViewMode === "cloud" ? (
                            <TagCloud tags={containers} onSelect={(id) => navigate(`/container/${id}`)} />
                        ) : (
                            <TagList tags={containers} onSelect={(id) => navigate(`/container/${id}`)} />
                        )
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;