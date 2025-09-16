import { Grid } from "@mui/material";
import { ItemRow } from "../services/items";
import { ItemCard } from "./ItemCard";

type Props = {
  items: ItemRow[];
};

export default function ItemGrid({ items }: Props) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
          <ItemCard name={item.name} imageUrl={item.imageUrl} />
        </Grid>
      ))}
    </Grid>
  );
}
