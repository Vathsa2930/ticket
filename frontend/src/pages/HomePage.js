import React from 'react';
import { Typography, Container } from '@mui/material';

const HomePage = () => {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Welcome to the Support Ticket System
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                You can view your existing tickets or create a new one from the navigation.
            </Typography>
        </Container>
    );
};

export default HomePage;
