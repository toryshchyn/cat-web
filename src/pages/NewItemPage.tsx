import React from "react";
import { Container, Typography } from "@mui/material";
import { useNewItemForm } from "../hooks/useNewItemForm";
import ItemForm from "../components/ItemForm";
import { useLocation } from "react-router-dom";

const NewItemPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { tagId?: number; containerId?: number };

  const {
    form,
    loading,
    saveItem
  } = useNewItemForm({
    tagId: state?.tagId,
    containerId: state?.containerId,
  });

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        New item
      </Typography>

      <ItemForm
        form={form}
        loading={loading}
        onSubmit={saveItem}
        mode="new"
      />
    </Container>
  );
};

export default NewItemPage;
