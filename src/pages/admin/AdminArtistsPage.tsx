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
import { useAdminArtists } from "../../hooks/admin/useAdminArtists.ts";
import AdminPageLayout from "../../components/admin/AdminPageLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ArtistDialog from "../../components/admin/ArtistDialog";

export default function AdminArtistsPage() {
  const {
    artists,
    genres,
    isLoading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    editingArtist,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
  } = useAdminArtists();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <AdminPageLayout
      title="Manage Artists"
      onAddClick={handleAdd}
      addText="Add Artist"
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>{artist.name}</TableCell>
                <TableCell>
                  {genres.find((g) => g.id === artist.genreId)?.name ?? "N/A"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(artist)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(artist.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ArtistDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        artist={editingArtist}
        genres={genres}
      />
    </AdminPageLayout>
  );
}
