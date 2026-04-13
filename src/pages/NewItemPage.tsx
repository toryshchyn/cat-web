import React from "react";
import { Box, Typography } from "@mui/material";
import { useNewItemForm } from "../hooks/useNewItemForm";
import ItemForm from "../components/item-form/ItemForm";
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
    <Box sx={{ maxWidth: 600, mx: "auto", pt: 4, pb: 4 }}>
      <Typography variant="h5" gutterBottom>
        New item
      </Typography>

      <ItemForm
        form={form}
        loading={loading}
        onSubmit={saveItem}
        mode="new"
      />
    </Box>
  );
};

export default NewItemPage;
