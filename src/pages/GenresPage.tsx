import { Box, Container, Typography } from "@mui/material";

export default function GenresPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Music Genres
        </Typography>
        <Typography variant="body1">
          Welcome to Spoty! The music library will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
}
