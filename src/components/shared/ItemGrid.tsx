import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { ItemRow } from "../../services/item-api-service";
import { ItemCard } from "./ItemCard";
import { ImageDisplay } from "./ImageDisplay";
import { useNavigate } from "react-router-dom";

type Props = {
  items: ItemRow[];
  mobileColumns?: 1 | 2;
  viewMode?: "grid" | "list";
};

export default function ItemGrid({ items, mobileColumns = 1, viewMode = "grid" }: Props) {
  const navigate = useNavigate();

  if (viewMode === "list") {
    return (
      <Stack spacing={1.2}>
        {items.map((item) => {
          const imageId = item.imageUrl ? Number(item.imageUrl.split("/").pop()) : null;
          return (
            <Paper
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              sx={{
                p: 1,
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                gap: 1.5,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                },
              }}
            >
              <Box sx={{ minWidth: 0, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                  {item.containerName ? `Container: ${item.containerName}` : "Container: Unknown"}
                </Typography>
              </Box>
              <Box sx={{ width: 72, height: 72, flexShrink: 0 }}>
                {imageId ? (
                  <ImageDisplay imageId={imageId} alt={item.name} width={72} height={72} />
                ) : (
                  <img
                    src="/placeholder.png"
                    alt={item.name}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4 }}
                  />
                )}
              </Box>
            </Paper>
          );
        })}
      </Stack>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid size={{ xs: mobileColumns === 2 ? 6 : 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
          <ItemCard
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            containerName={item.containerName}
            compactText={mobileColumns === 2}
          />
        </Grid>
      ))}
    </Grid>
  );
}
