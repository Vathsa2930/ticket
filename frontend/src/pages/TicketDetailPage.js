import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Container, Typography, Box, Paper, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Card, CardMedia } from '@mui/material';

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [message, setMessage] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const { user } = useContext(AuthContext);
    const [supportAgents, setSupportAgents] = useState([]);
    const [assignedTo, setAssignedTo] = useState('');

    const loadTicketData = useCallback(async () => {
        try {
            const ticketResponse = await api.get(`tickets/${id}/`);
            const currentTicket = ticketResponse.data;
            setTicket(currentTicket);
            setNewStatus(currentTicket.status);
            setAssignedTo(currentTicket.assigned_to?.id || '');

            if (user?.is_support) {
                const agentsResponse = await api.get('users/support-agents/');
                setSupportAgents(agentsResponse.data);
            }
        } catch (error) {
            console.error('Failed to load ticket data:', error);
        }
    }, [id, user?.is_support]);

    useEffect(() => {
        loadTicketData();
    }, [loadTicketData]);

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`tickets/${id}/messages/`, { message });
            setMessage('');
            loadTicketData(); // Refresh ticket data
        } catch (error) {
            console.error('Failed to post message', error);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await api.patch(`tickets/${id}/`, { status: newStatus });
            loadTicketData(); // Refresh ticket data
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleAssignTicket = async () => {
        try {
            await api.patch(`/tickets/${id}/`, { assigned_to_id: assignedTo });
            loadTicketData(); // Refresh ticket data
        } catch (error) {
            console.error('Failed to assign ticket', error);
        }
    };

    if (!ticket) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>{ticket.title}</Typography>
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h6">Ticket Details</Typography>
                    <Typography><strong>Status:</strong> {ticket.status}</Typography>
                    <Typography variant="body1"><strong>Assigned to:</strong> {ticket.assigned_to ? ticket.assigned_to.username : 'Unassigned'}</Typography>

                    {user && user.is_support && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="assign-agent-label">Assign To</InputLabel>
                                <Select
                                    labelId="assign-agent-label"
                                    value={assignedTo}
                                    label="Assign To"
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                >
                                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                                    {supportAgents.map((agent) => (
                                        <MenuItem key={agent.id} value={agent.id}>
                                            {agent.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button onClick={handleAssignTicket} variant="contained">Assign</Button>
                        </Box>
                    )}
                    <Typography><strong>Created by:</strong> {ticket.created_by.username}</Typography>
                    <Typography><strong>Description:</strong> {ticket.description}</Typography>
                    {ticket.attachment && (
                        <Card sx={{ maxWidth: 345, mt: 2 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={ticket.attachment}
                                alt="Attachment"
                            />
                        </Card>
                    )}
                </Paper>

                {user.is_support && (
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Update Status</InputLabel>
                        <Select value={ticket.status} onChange={handleStatusChange}>
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                )}

                <Typography variant="h5" gutterBottom>Comments</Typography>
                <Box sx={{ mb: 4 }}>
                    {ticket.messages.map(msg => (
                        <Paper key={msg.id} sx={{ p: 2, mb: 2, bgcolor: msg.user.username === user.username ? 'primary.light' : 'grey.200' }}>
                            <Typography variant="subtitle2">{msg.user.username} at {new Date(msg.timestamp).toLocaleString()}</Typography>
                            <Typography>{msg.message}</Typography>
                        </Paper>
                    ))}
                </Box>

                <form onSubmit={handleMessageSubmit}>
                    <TextField
                        label="Your Comment"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={3}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Comment
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default TicketDetailPage;
