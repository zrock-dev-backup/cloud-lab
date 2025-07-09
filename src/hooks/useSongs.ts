import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSongsByArtist } from "../services/musicService";
import type { Song } from "../models/music";

export const useSongs = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setError("Artist ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const fetchedSongs = await getSongsByArtist(artistId);
        setSongs(fetchedSongs);
      } catch (err) {
        console.error(`Failed to fetch songs for artist ${artistId}:`, err);
        setError("Could not load songs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [artistId]);

  const handlePlaySong = (song: Song) => {
    setNowPlaying(song);
  };

  return { songs, nowPlaying, isLoading, error, handlePlaySong };
};
