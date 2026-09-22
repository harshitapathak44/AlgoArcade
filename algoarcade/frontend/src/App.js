// ============================================================
// App.js - Root with routing
// ============================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage       from './pages/HomePage';
import AuthPage       from './pages/AuthPage';
import DashboardPage  from './pages/DashboardPage';
import TopicsPage     from './pages/TopicsPage';
import TopicDetailPage from './pages/TopicDetailPage';
import PuzzlePage     from './pages/PuzzlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage    from './pages/ProfilePage';
import VisualizerPage from './pages/VisualizerPage';

// Components
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/auth" replace />;
};

// Public only route (redirects logged-in users)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppContent = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-arcade-bg">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"    element={<HomePage />} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

        {/* Protected routes */}
        <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/topics"     element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
        <Route path="/topics/:id" element={<ProtectedRoute><TopicDetailPage /></ProtectedRoute>} />
        <Route path="/puzzle/:id" element={<ProtectedRoute><PuzzlePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/visualizer" element={<ProtectedRoute><VisualizerPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
