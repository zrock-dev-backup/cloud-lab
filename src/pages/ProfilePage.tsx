import { useAuth } from '../AuthContext.tsx';
import { linkWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import Button from '@mui/material/Button';

export default function ProfilePage() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <p>Please sign in to view your profile.</p>;
    }

    const handleLinkAccount = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        try {
            const result = await linkWithPopup(currentUser, provider);
            console.log("Account linked successfully!", result.user);
            alert("Account linked!");
        } catch (error: any) {
            if (error.code === 'auth/credential-already-in-use') {
                alert("This account is already associated with another user.");
            } else {
                console.error("Error linking account:", error);
                alert("Failed to link account.");
            }
        }
    };

    return (
        <div>
            <h1>Welcome, {currentUser.displayName || currentUser.email}</h1>
            <p>Providers linked:</p>
            <ul>
                {currentUser.providerData.map(profile => (
                    <li key={profile.providerId}>{profile.providerId}</li>
                ))}
            </ul>

            <Button onClick={() => handleLinkAccount(new GoogleAuthProvider())}>
                Link Google Account
            </Button>
            <Button onClick={() => handleLinkAccount(new FacebookAuthProvider())}>
                Link Facebook Account
            </Button>
        </div>
    );
}
