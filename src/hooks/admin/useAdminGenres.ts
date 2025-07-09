import { useState, useEffect, useCallback } from "react";
import {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  type GenreWithFile,
} from "../../services/musicService.ts";
import type { Genre } from "../../models/music.ts";

export const useAdminGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const fetchAndSetGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedGenres = await getGenres();
      setGenres(fetchedGenres);
      setError(null);
    } catch (err) {
      setError("Failed to fetch genres.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetGenres();
  }, [fetchAndSetGenres]);

  const handleAdd = () => {
    setEditingGenre(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setIsDialogOpen(true);
  };

  const handleDelete = async (genreId: string) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await deleteGenre(genreId);
        await fetchAndSetGenres();
      } catch (err) {
        setError("Failed to delete genre.");
      }
    }
  };

  const handleSave = async (data: GenreWithFile) => {
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, data);
      } else {
        await createGenre(data);
      }
      setIsDialogOpen(false);
      await fetchAndSetGenres();
    } catch (err) {
      setError("Failed to save genre.");
    }
  };

  return {
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
  };
};
