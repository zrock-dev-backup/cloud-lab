import {Alert, Box, Button, Card, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import {useSignIn} from '../hooks/useSignIn';
import {Link} from 'react-router-dom';

export default function SignInPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleSignIn,
    } = useSignIn();

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2}}>
            <Card variant="outlined" sx={{p: {xs: 2, sm: 4}, maxWidth: '450px', width: '100%'}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>

                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSignIn} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24}/> : 'Sign In'}
                    </Button>
                    <Stack direction="row" justifyContent="flex-end">
                        <Link to="/sign-up" style={{textDecoration: 'none'}}>
                            <Typography variant="body2" color="primary">
                                Sign Up
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}
