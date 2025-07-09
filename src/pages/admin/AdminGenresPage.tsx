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
import { useAdminGenres } from "../../hooks/admin/useAdminGenres.ts";
import AdminPageLayout from "../../components/admin/AdminPageLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import GenreDialog from "../../components/admin/GenreDialog";

export default function AdminGenresPage() {
  const {
    genres,
    isLoading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    editingGenre,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
  } = useAdminGenres();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <AdminPageLayout
      title="Manage Genres"
      onAddClick={handleAdd}
      addText="Add Genre"
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(genre)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(genre.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GenreDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        genre={editingGenre}
      />
    </AdminPageLayout>
  );
}
