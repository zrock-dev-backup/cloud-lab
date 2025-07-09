import { useState, useEffect, useCallback } from "react";
import {
  getSongsByArtist,
  createSong,
  updateSong,
  deleteSong,
  getArtistsByGenre,
  getGenres,
  type SongWithFile,
} from "../../services/musicService.ts";
import type { Song, Artist } from "../../models/music.ts";

export const useAdminSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedGenres = await getGenres();
      const fetchedArtists = (
        await Promise.all(fetchedGenres.map((g) => getArtistsByGenre(g.id)))
      ).flat();
      const fetchedSongs = (
        await Promise.all(fetchedArtists.map((a) => getSongsByArtist(a.id)))
      ).flat();

      setArtists(fetchedArtists);
      setSongs(fetchedSongs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch songs or artists.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdd = () => {
    setEditingSong(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setIsDialogOpen(true);
  };

  const handleDelete = async (songId: string) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await deleteSong(songId);
        await fetchAdminData();
      } catch (err) {
        setError("Failed to delete song.");
      }
    }
  };

  const handleSave = async (data: SongWithFile) => {
    try {
      if (editingSong) {
        await updateSong(editingSong.id, data);
      } else {
        await createSong(data);
      }
      setIsDialogOpen(false);
      await fetchAdminData();
    } catch (err) {
      setError("Failed to save song.");
    }
  };

  return {
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
  };
};
