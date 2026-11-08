import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import CVBuilder from './pages/user/CVBuilder';
import BrowseJobs from './pages/user/BrowseJobs';
import JobSuggestions from './pages/user/JobSuggestions';
import SkillSuggestions from './pages/user/SkillSuggestions';
import MyApplications from './pages/user/MyApplications';
import PrintCV from './pages/user/PrintCV';
import Chat from './pages/Chat';
import MyComplaints from './pages/user/MyComplaints';

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import PostJob from './pages/provider/PostJob';
import MyJobs from './pages/provider/MyJobs';
import ManageApplications from './pages/provider/ManageApplications';
import AdminMessages from './pages/provider/AdminMessages';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProviders from './pages/admin/ManageProviders';
import ActiveUsers from './pages/admin/ActiveUsers';
import ViewFeedback from './pages/admin/ViewFeedback';
import ManageComplaints from './pages/admin/ManageComplaints';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { token, user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ minHeight: '60vh' }}></div>;
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// Dashboard Router - redirects to role-specific dashboard
const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'provider') return <ProviderDashboard />;
  return <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Dashboard (role-based) */}
            <Route path="dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

            {/* User Routes */}
            <Route path="cv-builder" element={<ProtectedRoute roles={['user']}><CVBuilder /></ProtectedRoute>} />
            <Route path="browse-jobs" element={<ProtectedRoute roles={['user']}><BrowseJobs /></ProtectedRoute>} />
            <Route path="job-suggestions" element={<ProtectedRoute roles={['user']}><JobSuggestions /></ProtectedRoute>} />
            <Route path="skill-suggestions" element={<ProtectedRoute roles={['user']}><SkillSuggestions /></ProtectedRoute>} />
            <Route path="my-applications" element={<ProtectedRoute roles={['user']}><MyApplications /></ProtectedRoute>} />
            <Route path="print-cv" element={<ProtectedRoute roles={['user']}><PrintCV /></ProtectedRoute>} />
            <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="my-complaints" element={<ProtectedRoute roles={['user']}><MyComplaints /></ProtectedRoute>} />

            {/* Provider Routes */}
            <Route path="post-job" element={<ProtectedRoute roles={['provider']}><PostJob /></ProtectedRoute>} />
            <Route path="my-jobs" element={<ProtectedRoute roles={['provider']}><MyJobs /></ProtectedRoute>} />
            <Route path="manage-applications" element={<ProtectedRoute roles={['provider']}><ManageApplications /></ProtectedRoute>} />
            <Route path="admin-messages" element={<ProtectedRoute roles={['provider']}><AdminMessages /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="manage-providers" element={<ProtectedRoute roles={['admin']}><ManageProviders /></ProtectedRoute>} />
            <Route path="active-users" element={<ProtectedRoute roles={['admin']}><ActiveUsers /></ProtectedRoute>} />
            <Route path="view-feedback" element={<ProtectedRoute roles={['admin']}><ViewFeedback /></ProtectedRoute>} />
            <Route path="manage-complaints" element={<ProtectedRoute roles={['admin']}><ManageComplaints /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
