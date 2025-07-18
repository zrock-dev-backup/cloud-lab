import {Route, Routes} from 'react-router-dom';
import HomePage from "./Home.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from './pages/ProfilePage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import SignInPage from "./pages/SignInPage.tsx";
import PostsPage from "./pages/PostsPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/sign-in" element={<SignInPage/>}/>

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/posts"
                element={
                    <ProtectedRoute>
                        <PostsPage/>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
