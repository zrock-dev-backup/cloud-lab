import {useEffect, useState} from 'react';
import {useAuth} from '../AuthContext.tsx';
import {FacebookAuthProvider, GoogleAuthProvider, linkWithPopup, signOut} from 'firebase/auth';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {getUserProfile, updateUserProfile, type UserProfile} from '../services/userService.ts';
import {auth} from "../firebaseConfig.ts";
import {useNavigate} from "react-router-dom";

const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
};

export default function ProfilePage() {
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({address: '', birthDate: ''});

    useEffect(() => {
        if (currentUser) {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const userProfile = await getUserProfile(currentUser.uid);
                    if (userProfile) {
                        setProfile(userProfile);
                        setFormData({address: userProfile.address, birthDate: userProfile.birthDate});
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

    const handleLinkAccount = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        if (!currentUser) return;
        try {
            await linkWithPopup(currentUser, provider);
            alert("Account linked successfully!");
            // Manually re-fetch profile to update provider data display
            const updatedProfile = await getUserProfile(currentUser.uid);
            if (updatedProfile) setProfile(updatedProfile);
        } catch (error: any) {
            alert(error.code === 'auth/credential-already-in-use' ? "This account is already associated with another user." : "Failed to link account.");
            console.error("Error linking account:", error);
        }
    };

    const handleUpdate = async () => {
        if (!currentUser) return;
        try {
            await updateUserProfile(currentUser.uid, formData);
            setProfile(prev => prev ? {...prev, ...formData} : null);
            setIsEditing(false);
            alert("Profile updated!");
        } catch (err) {
            setError("Failed to update profile.");
        }
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/');
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    }

    if (loading) {
        return <Box
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><CircularProgress/></Box>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!profile) {
        return <Alert severity="warning">No profile data found.</Alert>;
    }

    const age = calculateAge(profile.birthDate);

    return (
        <Box sx={{p: 4}}>
            <Card>
                <CardContent>
                    <Typography variant="h4"
                                gutterBottom>Welcome, {profile.name || currentUser?.displayName}</Typography>

                    {isEditing ? (
                        <Stack spacing={2} component="form">
                            <TextField label="Address" value={formData.address}
                                       onChange={(e) => setFormData({...formData, address: e.target.value})} fullWidth/>
                            <TextField label="Birth Date" type="date" InputLabelProps={{shrink: true}}
                                       value={formData.birthDate}
                                       onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                                       fullWidth/>
                            <Box sx={{display: 'flex', gap: 2}}>
                                <Button variant="contained" onClick={handleUpdate}>Save</Button>
                                <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack spacing={1}>
                            <Typography><strong>Email:</strong> {profile.email}</Typography>
                            <Typography><strong>Address:</strong> {profile.address || 'Not provided'}</Typography>
                            <Typography><strong>Birth Date:</strong> {profile.birthDate || 'Not provided'}</Typography>
                            {age !== null && <Typography><strong>Age:</strong> {age}</Typography>}
                            <Button sx={{mt: 2, width: 'fit-content'}} variant="contained"
                                    onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </Stack>
                    )}

                    <Divider sx={{my: 3}}/>

                    <Typography variant="h6">Linked Accounts</Typography>
                    <Typography component="div">Providers linked:</Typography>
                    <ul>
                        {currentUser?.providerData.map(p => <li key={p.providerId}>{p.providerId}</li>)}
                    </ul>

                    <Stack direction="row" spacing={1} sx={{mt: 2}}>
                        <Button variant="outlined" onClick={() => handleLinkAccount(new GoogleAuthProvider())}>Link
                            Google</Button>
                        <Button variant="outlined" onClick={() => handleLinkAccount(new FacebookAuthProvider())}>Link
                            Facebook</Button>
                    </Stack>

                    <Button color="error" variant="contained" sx={{mt: 4}} onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
