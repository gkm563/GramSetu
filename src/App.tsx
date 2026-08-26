import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { MapViewPage } from './pages/MapViewPage';
import { WorkersPage } from './pages/WorkersPage';
import { CitizensPage } from './pages/CitizensPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Authority Command Center Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="map" element={<MapViewPage />} />
            <Route path="workers" element={<WorkersPage />} />
            <Route path="citizens" element={<CitizensPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
