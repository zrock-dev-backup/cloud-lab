// src/pages/admin/AdminSongsPage.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminSongs } from "../../hooks/admin/useAdminSongs.ts";
import AdminPageLayout from "../../components/admin/AdminPageLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SongDialog from "../../components/admin/SongDialog";

export default function AdminSongsPage() {
  const {
    songs,
    artists,
    isLoading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    editingSong,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
  } = useAdminSongs();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <AdminPageLayout
      title="Manage Songs"
      onAddClick={handleAdd}
      addText="Add Song"
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.id}>
                <TableCell>{song.name}</TableCell>
                <TableCell>
                  {artists.find((a) => a.id === song.artistId)?.name ?? "N/A"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(song)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(song.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SongDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        song={editingSong}
        artists={artists}
      />
    </AdminPageLayout>
  );
}
