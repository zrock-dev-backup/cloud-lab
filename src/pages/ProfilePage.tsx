import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.tsx";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  signOut,
} from "firebase/auth";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getUserProfile, type UserProfile } from "../services/userService.ts";
import { auth } from "../firebaseConfig.ts";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            setError("Could not find user profile. Please contact support.");
          }
        } catch (err) {
          setError("Failed to fetch profile.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [currentUser]);

  const handleLinkAccount = async (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => {
    if (!currentUser) return;
    try {
      await linkWithPopup(currentUser, provider);
      alert("Account linked successfully!");
      const updatedProfile = await getUserProfile(currentUser.uid);
      if (updatedProfile) setProfile(updatedProfile);
    } catch (error: any) {
      alert(
        error.code === "auth/credential-already-in-use"
          ? "This account is already associated with another user."
          : "Failed to link account.",
      );
      console.error("Error linking account:", error);
    }
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">No profile data found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "primary.main",
              fontWeight: 500,
              mb: 4,
            }}
          >
            Welcome, {profile.name || currentUser?.displayName}
          </Typography>

          <Typography variant="body1">
            <strong>Email:</strong> {profile.email}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Linked Accounts
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Providers linked:
            </Typography>
            <Stack spacing={1}>
              {currentUser?.providerData.map((p) => (
                <Typography
                  key={p.providerId}
                  sx={{
                    pl: 2,
                    py: 0.5,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  {p.providerId}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              onClick={() => handleLinkAccount(new GoogleAuthProvider())}
              startIcon={<GoogleIcon />}
            >
              Link Google
            </Button>
          </Stack>

          <Button
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{
              mt: 2,
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
