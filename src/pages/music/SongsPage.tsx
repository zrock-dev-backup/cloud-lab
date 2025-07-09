import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  Typography,
} from "@mui/material";
import { useSongs } from "../../hooks/useSongs.ts";
import SongItem from "../../components/SongItem.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import ErrorMessage from "../../components/ErrorMessage.tsx";

export default function SongsPage() {
  const { songs, nowPlaying, isLoading, error, handlePlaySong } = useSongs();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Songs
      </Typography>
      <Card>
        <CardContent>
          {songs.length > 0 ? (
            <List>
              {songs.map((song) => (
                <SongItem
                  key={song.id}
                  name={song.name}
                  onClick={() => handlePlaySong(song)}
                />
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No songs found for this artist.
            </Typography>
          )}
        </CardContent>
      </Card>

      {nowPlaying && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            p: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" align="center">
            {nowPlaying.name}
          </Typography>
          <audio
            controls
            autoPlay
            src={nowPlaying.songUrl}
            style={{ width: "100%" }}
          >
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </Container>
  );
}
