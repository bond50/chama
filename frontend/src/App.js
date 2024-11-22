import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import UserListPage from './pages/UserListPage';
import './App.css';
import Dashboard from './pages/Dashboard';
import Pick from './pages/Pick';
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/Home";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pick" element={<Pick />} />
            <Route path="/users" element={<UserListPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
