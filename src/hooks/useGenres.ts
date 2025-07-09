import { useState, useEffect } from "react";
import { getGenres } from "../services/musicService";
import type { Genre } from "../models/music";

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const fetchedGenres = await getGenres();
        setGenres(fetchedGenres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        setError("Could not load genres. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, isLoading, error };
};
