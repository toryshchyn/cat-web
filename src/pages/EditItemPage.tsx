import React from "react";
import { Box, Typography } from "@mui/material";
import { useEditItemForm } from "../hooks/useEditItemForm";
import ItemForm from "../components/item-form/ItemForm";

const EditItemPage: React.FC = () => {
  const {
    form,
    loading,
    updateItem,
    initialImageUrl
  } = useEditItemForm();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
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
    </Box>
  );
};

export default EditItemPage;
