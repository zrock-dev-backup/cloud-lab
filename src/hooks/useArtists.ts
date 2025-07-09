import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArtistsByGenre } from "../services/musicService";
import type { Artist } from "../models/music";

export const useArtists = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genreId) {
      setError("Genre ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        const fetchedArtists = await getArtistsByGenre(genreId);
        setArtists(fetchedArtists);
      } catch (err) {
        console.error(`Failed to fetch artists for genre ${genreId}:`, err);
        setError("Could not load artists. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [genreId]);

  return { artists, isLoading, error, genreId };
};
