import { NavLink, Outlet } from "react-router-dom";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

const adminNavLinks = [
  { title: "Genres", to: "/admin/genres" },
  { title: "Artists", to: "/admin/artists" },
  { title: "Songs", to: "/admin/songs" },
];

export default function AdminLayout() {
  const navLinkStyle = {
    textDecoration: "none",
    color: "inherit",
    padding: "8px 16px",
    borderRadius: "4px",
  };

  const activeNavLinkStyle = {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        component={Paper}
        elevation={1}
        sx={{ p: 1, mb: 4, borderRadius: 1 }}
      >
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? activeNavLinkStyle : {}),
            })}
          >
            {link.title}
          </NavLink>
        ))}
      </Stack>
      <Box>
        <Outlet />
      </Box>
    </Container>
  );
}
