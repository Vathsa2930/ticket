import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const { registerUser } = useContext(AuthContext);

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" />
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                    <TextField margin="normal" fullWidth id="first_name" label="First Name" name="first_name" autoComplete="given-name" />
                    <TextField margin="normal" fullWidth id="last_name" label="Last Name" name="last_name" autoComplete="family-name" />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Link to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUpPage;
