import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { ImageDisplay } from "./ImageDisplay";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  name: string;
  imageUrl?: string;
  containerName?: string;
  compactText?: boolean;
};

export function ItemCard({ id, name, imageUrl, containerName, compactText = false }: Props) {
  const navigate = useNavigate();

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
      onClick={() => {
        navigate(`/item/${id}`)
      }
      }
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
            variant={compactText ? "body2" : "body1"}
            align="center"
            noWrap
            sx={{ fontWeight: 500, fontSize: compactText ? "0.78rem" : undefined }}
          >
            {name}
          </Typography>
          {containerName && (
            <Typography
              variant="caption"
              align="center"
              noWrap
              sx={{ fontWeight: 500, mt: compactText ? 0.5 : 1, fontSize: compactText ? "0.68rem" : undefined }}
            >
              Container: {containerName}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
