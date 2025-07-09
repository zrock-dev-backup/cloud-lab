import { useState, useEffect, useCallback } from "react";
import {
  getArtistsByGenre,
  createArtist,
  updateArtist,
  deleteArtist,
  getGenres,
  type ArtistWithFile,
} from "../../services/musicService.ts";
import type { Artist, Genre } from "../../models/music.ts";

export const useAdminArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedArtists, fetchedGenres] = await Promise.all([
        getGenres()
          .then((gs) => Promise.all(gs.map((g) => getArtistsByGenre(g.id))))
          .then((a) => a.flat()),
        getGenres(),
      ]);
      setArtists(fetchedArtists);
      setGenres(fetchedGenres);
      setError(null);
    } catch (err) {
      setError("Failed to fetch artists or genres.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdd = () => {
    setEditingArtist(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setIsDialogOpen(true);
  };

  const handleDelete = async (artistId: string) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      try {
        await deleteArtist(artistId);
        await fetchAdminData();
      } catch (err) {
        setError("Failed to delete artist.");
      }
    }
  };

  const handleSave = async (data: ArtistWithFile) => {
    try {
      if (editingArtist) {
        await updateArtist(editingArtist.id, data);
      } else {
        await createArtist(data);
      }
      setIsDialogOpen(false);
      await fetchAdminData();
    } catch (err) {
      setError("Failed to save artist.");
    }
  };

  return {
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
  };
};
