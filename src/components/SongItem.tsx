import { ListItem, ListItemButton, ListItemText, SvgIcon } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface SongItemProps {
  name: string;
  onClick: () => void;
}

export default function SongItem({ name, onClick }: SongItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <SvgIcon component={MusicNoteIcon} sx={{ mr: 2 }} />
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}
