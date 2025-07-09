import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import type { Genre } from "../../models/music";
import type { GenreWithFile } from "../../services/musicService";

interface GenreDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: GenreWithFile) => Promise<void>;
  genre: Genre | null;
}

export default function GenreDialog({
  open,
  onClose,
  onSave,
  genre,
}: GenreDialogProps) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(genre?.name ?? "");
      setImageFile(undefined);
    }
  }, [genre, open]);

  const handleSave = async () => {
    if (!name || (!imageFile && !genre)) {
      alert("Name and image are required.");
      return;
    }
    setIsSaving(true);
    await onSave({ name, imageFile });
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{genre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Genre Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          />
        </Button>
        {imageFile && <p>Selected: {imageFile.name}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
