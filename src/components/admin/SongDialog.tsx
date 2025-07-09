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
import type { Song, Artist } from "../../models/music";
import type { SongWithFile } from "../../services/musicService";

interface SongDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SongWithFile) => Promise<void>;
  song: Song | null;
  artists: Artist[];
}

export default function SongDialog({
  open,
  onClose,
  onSave,
  song,
  artists,
}: SongDialogProps) {
  const [name, setName] = useState("");
  const [artistId, setArtistId] = useState("");
  const [songFile, setSongFile] = useState<File | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(song?.name ?? "");
      setArtistId(song?.artistId ?? "");
      setSongFile(undefined);
    }
  }, [song, open]);

  const handleSave = async () => {
    if (!name || !artistId || (!songFile && !song)) {
      alert("Name, artist, and MP3 file are required.");
      return;
    }
    setIsSaving(true);
    await onSave({ name, artistId, songFile });
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{song ? "Edit Song" : "Add New Song"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Song Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel id="artist-select-label">Artist</InputLabel>
          <Select
            labelId="artist-select-label"
            value={artistId}
            label="Artist"
            onChange={(e) => setArtistId(e.target.value)}
          >
            {artists.map((artist) => (
              <MenuItem key={artist.id} value={artist.id}>
                {artist.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload MP3 File
          <input
            type="file"
            hidden
            accept="audio/mpeg"
            onChange={(e) => e.target.files && setSongFile(e.target.files[0])}
          />
        </Button>
        {songFile && <p>Selected: {songFile.name}</p>}
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
