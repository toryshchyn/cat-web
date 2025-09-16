import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { ImageDisplay } from "./ImageDisplay";

type Props = {
  name: string;
  imageUrl?: string;
};

export function ItemCard({ name, imageUrl }: Props) {
  const imageId = imageUrl ? Number(imageUrl.split("/").pop()) : null;

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        transition: "all 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardActionArea sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {imageUrl ? (
            <ImageDisplay imageId={imageId} alt={name} width="100%" height="100%" />
          ) : (
            <img
              src="/placeholder.png"
              alt={name}
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />
          )}
        </Box>

        <CardContent sx={{ p: 1, width: "100%" }}>
          <Typography
            variant="subtitle2"
            align="center"
            noWrap
            sx={{ fontWeight: 500 }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
