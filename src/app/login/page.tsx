'use client'
import React, {useState} from 'react';
import {login, logout, useAuth} from '@/app/util/auth'
import {Box, Button, Container, Grid, TextField, Typography} from '@mui/material';
import AdminPage from "@/app/login/adminpage/adminPage";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const currentUser = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Innlogging mislyktes: ' + (error as Error).message);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (currentUser) {
        return (
            <>
                <Container component="main"  maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item lg={6} justifyContent="center" spacing={2}>
                            <Typography variant="h6">
                                Velkommen, {currentUser.email}
                            </Typography>
                        </Grid>

                        <Grid item lg={12}>
                            <AdminPage></AdminPage>
                        </Grid>
                        <Grid item lg={2} >
                            <Button
                                variant="contained"
                                onClick={handleLogout}
                                sx={{mt: 1, mb: 1}}
                            >
                                <Typography>Logg Ut</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container component="main">

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Logg inn
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} sx={{mt: 1}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="E-post"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Passord"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            <Typography>
                                Logg Inn
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;