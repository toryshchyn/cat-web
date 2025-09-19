import { Box, Typography } from "@mui/material";
import { TagWithCount } from "../services/tag-api-service";
import { useNavigate } from "react-router-dom";

type Props = {
  tags: TagWithCount[];
  onSelect: (id: number) => void;
};

export default function TagCloud({ tags }: Props) {
  const navigate = useNavigate();

  const max = Math.max(...tags.map((t) => t.count), 1);
  const min = Math.min(...tags.map((t) => t.count), 0);

  const getFontSize = (count: number) => {
    const minSize = 0.8;
    const maxSize = 2.2;
    if (max === min) {
      return `${(minSize + maxSize) / 2}rem`;
    }
    const ratio = (count - min) / (max - min);
    return `${minSize + ratio * (maxSize - minSize)}rem`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        py: 2,
      }}
    >
      {tags.map((tag) => (
        <Typography
          key={tag.id}
          onClick={() => navigate(`/tag/${tag.id}`)}
          sx={{
            fontSize: getFontSize(tag.count),
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
              textDecoration: "underline",
            },
          }}
        >
          {tag.name}
        </Typography>
      ))}
    </Box>
  );
}
