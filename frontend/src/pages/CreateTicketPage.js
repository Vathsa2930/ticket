import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Container, Typography, TextField, Button, Box, Input
} from '@mui/material';

const CreateTicketPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            await api.post('tickets/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to create ticket', error);
            alert('Failed to create ticket. Please try again.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create a New Support Ticket
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                        Upload Attachment
                        <Input type="file" hidden onChange={(e) => setAttachment(e.target.files[0])} />
                    </Button>
                    {attachment && <Typography sx={{ ml: 2, display: 'inline' }}>{attachment.name}</Typography>}
                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit Ticket
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default CreateTicketPage;
