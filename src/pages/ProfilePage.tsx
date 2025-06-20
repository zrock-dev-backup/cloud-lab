import {useEffect, useState} from 'react';
import {useAuth} from '../AuthContext.tsx';
import {FacebookAuthProvider, GoogleAuthProvider, linkWithPopup, signOut} from 'firebase/auth';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {getUserProfile, updateUserProfile, type UserProfile} from '../services/userService.ts';
import {auth} from "../firebaseConfig.ts";
import {useNavigate} from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{mt: 4}}>
                <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="md" sx={{mt: 4}}>
                <Alert severity="warning">No profile data found.</Alert>
            </Container>
        );
    }

    const age = calculateAge(profile.birthDate);

    return (
        <Container maxWidth="md" sx={{py: 4}}>
            <Paper elevation={3} sx={{borderRadius: 2}}>
                <Box sx={{p: 4}}>
                    <Typography variant="h4" gutterBottom sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        mb: 4
                    }}>
                        Welcome, {profile.name || currentUser?.displayName}
                    </Typography>

                    {isEditing ? (
                        <Stack spacing={3} component="form" sx={{mb: 4}}>
                            <TextField
                                label="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Birth Date"
                                type="date"
                                InputLabelProps={{shrink: true}}
                                value={formData.birthDate}
                                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                                fullWidth
                                variant="outlined"
                            />
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleUpdate}
                                    startIcon={<SaveIcon/>}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    startIcon={<CancelIcon/>}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Box sx={{mb: 4}}>
                            <Stack spacing={2}>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {profile.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Address:</strong> {profile.address || 'Not provided'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Birth Date:</strong> {profile.birthDate || 'Not provided'}
                                </Typography>
                                {age !== null && (
                                    <Typography variant="body1">
                                        <strong>Age:</strong> {age}
                                    </Typography>
                                )}
                                <Button
                                    sx={{mt: 2, width: 'fit-content'}}
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                    startIcon={<EditIcon/>}
                                >
                                    Edit Profile
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    <Divider sx={{my: 4}}/>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/posts')}>
                        View Posts
                    </Button>

                    <Divider sx={{my: 4}}/>

                    <Typography variant="h6" sx={{mb: 2, color: 'primary.main'}}>
                        Linked Accounts
                    </Typography>

                    <Box sx={{mb: 3}}>
                        <Typography variant="body1" sx={{mb: 1}}>Providers linked:</Typography>
                        <Stack spacing={1}>
                            {currentUser?.providerData.map(p => (
                                <Typography key={p.providerId} sx={{
                                    pl: 2,
                                    py: 0.5,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1
                                }}>
                                    {p.providerId}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{mb: 4}}>
                        <Button
                            variant="outlined"
                            onClick={() => handleLinkAccount(new GoogleAuthProvider())}
                            startIcon={<GoogleIcon/>}
                        >
                            Link Google
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleLinkAccount(new FacebookAuthProvider())}
                            startIcon={<FacebookIcon/>}
                        >
                            Link Facebook
                        </Button>
                    </Stack>

                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<LogoutIcon/>}
                        onClick={handleSignOut}
                        sx={{
                            mt: 2,
                            '&:hover': {
                                backgroundColor: 'error.dark'
                            }
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}