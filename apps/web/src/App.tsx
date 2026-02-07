import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/Header'
import { AdminLayout } from './components/AdminLayout'
import { Login } from './pages/Login'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ClinicSettings } from './pages/admin/ClinicSettings'
import { UserManagement } from './pages/admin/UserManagement'
import { UserDetailPage } from './pages/admin/UserDetailPage'
import { RoleManagement } from './pages/admin/RoleManagement'
import { AuditExport } from './pages/admin/AuditExport'
import { apolloClient } from './apollo/client'

function AppPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">TessDental</h1>
          <p className="text-gray-600">Welcome to your dental practice management system</p>
        </div>
      </main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="clinic-settings" element={<ClinicSettings />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="audit" element={<AuditExport />} />
      </Route>
      <Route
        path="/"
        element={<Navigate to="/app" replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  )
}

export default App
