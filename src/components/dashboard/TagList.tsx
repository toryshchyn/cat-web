import { List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";

type Tag = {
  id: number;
  name: string;
  count?: number;
};

type Props = {
  tags: Tag[];
  onSelect: (id: number) => void;
};

export default function TagList({ tags, onSelect }: Props) {
  return (
    <List>
      {tags.map((tag) => (
        <Paper key={tag.id} sx={{ mb: 1 }}>
          <ListItemButton onClick={() => onSelect(tag.id)}>
            <ListItemText primary={tag.name} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {tag.count ?? 0}
            </Typography>
          </ListItemButton>
        </Paper>
      ))}
    </List>
  );
}
