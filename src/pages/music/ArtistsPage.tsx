import { Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useArtists } from "../../hooks/useArtists.ts";
import MediaCard from "../../components/MediaCard.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import ErrorMessage from "../../components/ErrorMessage.tsx";

export default function ArtistsPage() {
  const { artists, isLoading, error } = useArtists();
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
        Artists
      </Typography>
      {artists.length > 0 ? (
        <Grid container spacing={4}>
          {artists.map((artist) => (
            <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <MediaCard
                name={artist.name}
                imageUrl={artist.imageUrl}
                onClick={() => navigate(`/artists/${artist.id}/songs`)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          No artists found for this genre.
        </Typography>
      )}
    </Container>
  );
}
