import React, { useState } from 'react';
import { Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import ViewToggle from "../components/ViewToggle";
import TagList from "../components/TagList";
import TagCloud from "../components/TagCloud";
import { useNavigate } from "react-router-dom";
import { useTagsWithCounts } from "../hooks/useTagsWithCounts";

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth0();
    const [viewMode, setViewMode] = useState<"cloud" | "list">("cloud");
    const navigate = useNavigate();
    const { tags, loading, error } = useTagsWithCounts();

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
                Welcome, {user?.name}
            </Typography>

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

            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Logout
            </Button>
        </Box>
    );
};

export default Dashboard;