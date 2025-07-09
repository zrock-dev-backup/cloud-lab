import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Home.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import GenresPage from "./pages/music/GenresPage.tsx";
import ArtistsPage from "./pages/music/ArtistsPage.tsx";
import SongsPage from "./pages/music/SongsPage.tsx";
import Layout from "./Layout.tsx";

import AdminRoute from "./components/admin/AdminRoute.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminGenresPage from "./pages/admin/AdminGenresPage.tsx";
import AdminArtistsPage from "./pages/admin/AdminArtistsPage.tsx";
import AdminSongsPage from "./pages/admin/AdminSongsPage.tsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-in" element={<SignInPage />} />

      {/* Protected routes for regular users */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/genres/:genreId/artists" element={<ArtistsPage />} />
        <Route path="/artists/:artistId/songs" element={<SongsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/genres" replace />} />
            <Route path="genres" element={<AdminGenresPage />} />
            <Route path="artists" element={<AdminArtistsPage />} />
            <Route path="songs" element={<AdminSongsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
