import { Route, Routes } from 'react-router-dom';
import HomePage from "./Home.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from './pages/ProfilePage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import SignInPage from "./pages/SignInPage.tsx";
import GenresPage from "./pages/GenresPage.tsx";
import Layout from './Layout.tsx';

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/genres" element={<GenresPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    );
}

export default App;
