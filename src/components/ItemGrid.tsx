import { Grid } from "@mui/material";
import { ItemRow } from "../services/item-api-service";
import { ItemCard } from "./ItemCard";

type Props = {
  items: ItemRow[];
};

export default function ItemGrid({ items }: Props) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
          <ItemCard id={item.id} name={item.name} imageUrl={item.imageUrl} containerName={item.containerName} />
        </Grid>
      ))}
    </Grid>
  );
}
