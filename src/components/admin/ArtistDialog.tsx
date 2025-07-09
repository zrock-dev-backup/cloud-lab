import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { Artist, Genre } from "../../models/music";
import type { ArtistWithFile } from "../../services/musicService";

interface ArtistDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ArtistWithFile) => Promise<void>;
  artist: Artist | null;
  genres: Genre[];
}

export default function ArtistDialog({
  open,
  onClose,
  onSave,
  artist,
  genres,
}: ArtistDialogProps) {
  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(artist?.name ?? "");
      setGenreId(artist?.genreId ?? "");
      setImageFile(undefined);
    }
  }, [artist, open]);

  const handleSave = async () => {
    if (!name || !genreId || (!imageFile && !artist)) {
      alert("Name, genre, and image are required.");
      return;
    }
    setIsSaving(true);
    await onSave({ name, genreId, imageFile });
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{artist ? "Edit Artist" : "Add New Artist"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Artist Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel id="genre-select-label">Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            value={genreId}
            label="Genre"
            onChange={(e) => setGenreId(e.target.value)}
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
