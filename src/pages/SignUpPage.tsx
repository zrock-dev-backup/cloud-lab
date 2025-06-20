import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Alert, Card, Divider, Stack, styled, TextField, Typography} from "@mui/material";
import {
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import {auth} from '../firebaseConfig.ts';
import CssBaseline from "@mui/material/CssBaseline";
import {createUserProfileDocument} from "../services/userService.ts";
import {useNavigate} from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";


const SignUpContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUpPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generateStatus, setGenerateStatus] = useState<{
        type: 'success' | 'error' | 'warning';
        message: string
    } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!name || name.length < 1) {
            setError('Name is required.');
            setIsSubmitting(false);
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsSubmitting(false);
            return;
        }

        try {
            const {user} = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, {displayName: name});
            await createUserProfileDocument(user, {name, email, address, birthDate});
            setGenerateStatus({type: 'success', message: 'Account created successfully. Redirecting...'});
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setGenerateStatus({type: 'error', message: 'This email address is already in use.'});
            } else {
                setGenerateStatus({type: 'error', message: 'Failed to create an account. Please try again.'});
            }
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        setIsSubmitting(true);
        try {
            const {user} = await signInWithPopup(auth, provider);
            await createUserProfileDocument(user); // Creates doc if it doesn't exist
            setGenerateStatus({type: 'success', message: 'Signed in successfully. Redirecting...'});
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error: any) {
            console.error("Social Sign-In Error: ", error);
            setGenerateStatus({type: 'error', message: 'Failed to sign in. Please try again.'});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <CssBaseline enableColorScheme/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined" sx={{p: {xs: 2, sm: 4}, maxWidth: '500px', margin: 'auto'}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Sign up
                    </Typography>

                    {generateStatus && (
                        <Alert severity={generateStatus.type} sx={{mb: 2}} onClose={() => setGenerateStatus(null)}>
                            {generateStatus.message}
                        </Alert>
                    )}
                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name"
                                   autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)}
                                   disabled={isSubmitting}/>
                        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email"
                                   autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                   disabled={isSubmitting}/>
                        <TextField margin="normal" required fullWidth name="password" label="Password" type="password"
                                   id="password" autoComplete="new-password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting}/>
                        <TextField margin="normal" fullWidth name="address" label="Address" id="address"
                                   autoComplete="street-address" value={address}
                                   onChange={(e) => setAddress(e.target.value)} disabled={isSubmitting}/>
                        <TextField margin="normal" fullWidth name="birthDate" label="Birth Date" type="date"
                                   id="birthDate" InputLabelProps={{shrink: true}} value={birthDate}
                                   onChange={(e) => setBirthDate(e.target.value)} disabled={isSubmitting}/>

                        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}} disabled={isSubmitting}>
                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    </Box>
                    <Divider sx={{my: 2}}>or</Divider>

                    <Stack spacing={1} sx={{width: '100%'}}>
                        <Button fullWidth variant="outlined"
                                startIcon={<GoogleIcon/>}
                                onClick={() => handleSocialSignIn(new GoogleAuthProvider())} disabled={isSubmitting}>
                            Sign up with Google
                        </Button>
                        <Button fullWidth variant="outlined"
                                startIcon={<FacebookIcon/>}
                                onClick={() => handleSocialSignIn(new FacebookAuthProvider())} disabled={isSubmitting}>
                            Sign up with Facebook
                        </Button>
                    </Stack>
                </Card>
            </SignUpContainer>
        </div>
    );
}
