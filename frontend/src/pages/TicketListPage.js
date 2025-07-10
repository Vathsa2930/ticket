import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { 
    Container, Typography, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, Box,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('tickets/', {
                    params: { status: filterStatus || undefined },
                });
                setTickets(response.data);
            } catch (error) {
                console.error('Failed to fetch tickets', error);
            }
        };

        fetchTickets();
    }, [filterStatus]);

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
                <Typography variant="h4">
                    Support Tickets
                </Typography>
                {user && user.is_customer && (
                    <Button variant="contained" color="primary" component={Link} to="/create-ticket">
                        Create New Ticket
                    </Button>
                )}
            </Box>

            {user && user.is_support && (
                <Box sx={{ mb: 4, width: '250px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            value={filterStatus}
                            label="Filter by Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value=""><em>All Tickets</em></MenuItem>
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/tickets/${ticket.id}`} variant="outlined">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TicketListPage;
