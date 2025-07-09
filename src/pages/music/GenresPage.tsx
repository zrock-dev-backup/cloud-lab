import { Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGenres } from "../../hooks/useGenres.ts";
import MediaCard from "../../components/MediaCard.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import ErrorMessage from "../../components/ErrorMessage.tsx";

export default function GenresPage() {
  const { genres, isLoading, error } = useGenres();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Music Genres
      </Typography>
      <Grid container spacing={4}>
        {genres.map((genre) => (
          <Grid key={genre.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MediaCard
              name={genre.name}
              imageUrl={genre.imageUrl}
              onClick={() => navigate(`/genres/${genre.id}/artists`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
