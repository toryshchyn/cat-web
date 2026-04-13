import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

type Props = {
  tags: { id: number; name: string; count?: number }[];
  onSelect: (id: number) => void;
};

export default function TagCloud({ tags, onSelect }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const max = Math.max(...tags.map((t) => t.count ?? 1), 1);
  const min = Math.min(...tags.map((t) => t.count ?? 1), 1);

  const getFontSize = (count: number) => {
    const minSize = isMobile ? 0.38 : 0.62;
    const maxSize = isMobile ? 1.2 : 1.75;
    if (max === min) {
      return `${(minSize + maxSize) / 2}rem`;
    }
    const ratio = ((count ?? 1) - min) / (max - min);
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
          onClick={() => onSelect(tag.id)}
          sx={{
            fontSize: getFontSize(tag.count ?? 1),
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
