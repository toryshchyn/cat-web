import { List, ListItemButton, ListItemText, Paper } from "@mui/material";

type Tag = {
  id: number;
  name: string
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
          </ListItemButton>
        </Paper>
      ))}
    </List>
  );
}
