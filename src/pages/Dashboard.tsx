import React, { useState } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import ViewToggle from "../components/dashboard/ViewToggle";
import TagList from "../components/dashboard/TagList";
import TagCloud from "../components/dashboard/TagCloud";
import { useNavigate } from "react-router-dom";
import { useTagsWithCounts } from "../hooks/useTagsWithCounts";

const Dashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<"cloud" | "list">("cloud");
    const navigate = useNavigate();
    const { tags, loading, error } = useTagsWithCounts();

    return (
        <Box sx={{ my: 4 }}>
            <Container sx={{ py: 2 }}>

                <ViewToggle mode={viewMode} onChange={setViewMode} />

                <Box sx={{ mt: 2 }}>
                    {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && <Typography color="error">{error}</Typography>}

                    {!loading && !error && tags.length === 0 && (
                        <Typography color="text.secondary">No tags found.</Typography>
                    )}

                    {!loading && !error && tags.length > 0 && (
                        viewMode === "cloud" ? (
                            <TagCloud tags={tags} onSelect={(id) => navigate(`/tag/${id}`)} />
                        ) : (
                            <TagList tags={tags} onSelect={(id) => navigate(`/tag/${id}`)} />
                        )
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Dashboard;