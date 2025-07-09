import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSignOut = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/genres")}
        >
          Spoty
        </Typography>
        <Button color="inherit" onClick={() => navigate("/genres")}>
          Genres
        </Button>
        <Button color="inherit" onClick={() => navigate("/profile")}>
          Profile
        </Button>
        {isAdmin && (
          <Button color="inherit" onClick={() => navigate("/admin")}>
            Admin
          </Button>
        )}
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
