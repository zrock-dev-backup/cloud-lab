import { Routes, Route } from 'react-router-dom';
import HomePage from "./Home.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from './pages/ProfilePage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
             {/*<Route path="/sign-in" element={<SignIn />} />*/}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
export default App;
