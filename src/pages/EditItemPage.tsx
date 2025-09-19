import React from "react";
import { Container, Typography } from "@mui/material";
import { useEditItemForm } from "../hooks/useEditItemForm";
import ItemForm from "../components/ItemForm";

const EditItemPage: React.FC = () => {
  const {
    form,
    loading,
    updateItem,
    initialImageUrl
  } = useEditItemForm();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit item
      </Typography>

      <ItemForm
        form={form}
        loading={loading}
        onSubmit={updateItem}
        mode="edit"
        initialImageUrl={initialImageUrl}
      />
    </Container>
  );
};

export default EditItemPage;
