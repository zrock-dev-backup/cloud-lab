import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AdminPageLayoutProps {
  title: string;
  onAddClick: () => void;
  addText: string;
  children: React.ReactNode;
}

export default function AdminPageLayout({
  title,
  onAddClick,
  addText,
  children,
}: AdminPageLayoutProps) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          {addText}
        </Button>
      </Stack>
      {children}
    </Box>
  );
}
