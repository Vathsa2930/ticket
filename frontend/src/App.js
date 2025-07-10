import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './utils/PrivateRoute';
import TicketListPage from './pages/TicketListPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<TicketListPage />} />
                        <Route path="/create-ticket" element={<CreateTicketPage />} />
                        <Route path="/tickets/:id" element={<TicketDetailPage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

