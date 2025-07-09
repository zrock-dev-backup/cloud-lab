import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  Alert,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { GoogleAuthProvider } from "firebase/auth";
import CssBaseline from "@mui/material/CssBaseline";
import GoogleIcon from "@mui/icons-material/Google";
import { SignUpContainer } from "./SignUpPage.styles.ts";
import { useSignUp } from "../hooks/useSignUp.ts";

export default function SignUpPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    validationError,
    isSubmitting,
    status,
    setStatus,
    handleSubmit,
    handleSocialSignIn,
  } = useSignUp();

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card
          variant="outlined"
          sx={{ p: { xs: 2, sm: 4 }, maxWidth: "500px", margin: "auto" }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign up
          </Typography>

          {status && (
            <Alert
              severity={status.type}
              sx={{ mb: 2 }}
              onClose={() => setStatus(null)}
            >
              {status.message}
            </Alert>
          )}
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>
          <Divider sx={{ my: 2 }}>or</Divider>

          <Stack spacing={1} sx={{ width: "100%" }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialSignIn(new GoogleAuthProvider())}
              disabled={isSubmitting}
            >
              Sign up with Google
            </Button>
          </Stack>
        </Card>
      </SignUpContainer>
    </div>
  );
}
