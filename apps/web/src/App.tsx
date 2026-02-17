import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './components/AdminLayout'
import { DefaultLayout } from './components/DefaultLayout'
import { Login } from './pages/Login'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ClinicSettings } from './pages/admin/ClinicSettings'
import { UserManagement } from './pages/admin/UserManagement'
import { UserDetailPage } from './pages/admin/UserDetailPage'
import { RoleManagement } from './pages/admin/RoleManagement'
import { AuditExport } from './pages/admin/AuditExport'
import { PatientFieldConfig } from './pages/admin/PatientFieldConfig'
import { ReferralSourceManagement } from './pages/admin/ReferralSourceManagement'
import { PersonsTable } from './pages/admin/PersonsTable'
import { ImagingTemplates } from './pages/admin/ImagingTemplates'
import { PersonProfile } from './pages/profile/PersonProfile'
import { Imaging } from './pages/Imaging'
import { Notes } from './pages/Notes'
import { Odontogram } from './pages/Odontogram'
import { Perio } from './pages/Perio'
import { Forms } from './pages/Forms'
import { Billing } from './pages/Billing'
import { Insurance } from './pages/Insurance'
import { Prescriptions } from './pages/Prescriptions'
import { Documents } from './pages/Documents'
import { Dashboard } from './pages/Dashboard'
import { apolloClient } from './apollo/client'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
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
        <Route path="patients" element={<Navigate to="/admin/patients/persons" replace />} />
        <Route path="patients/persons" element={<PersonsTable />} />
        <Route path="patients/fields" element={<PatientFieldConfig />} />
        <Route path="patients/referral-sources" element={<ReferralSourceManagement />} />
        <Route path="imaging" element={<ImagingTemplates />} />
        <Route path="audit" element={<AuditExport />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="profile/:personId" element={<PersonProfile />} />
        <Route path="notes/:personId" element={<Notes />} />
        <Route path="odontogram/:personId" element={<Odontogram />} />
        <Route path="perio/:personId" element={<Perio />} />
        <Route path="imaging/:personId" element={<Imaging />} />
        <Route path="forms/:personId" element={<Forms />} />
        <Route path="billing/:personId" element={<Billing />} />
        <Route path="insurance/:personId" element={<Insurance />} />
        <Route path="prescriptions/:personId" element={<Prescriptions />} />
        <Route path="documents/:personId" element={<Documents />} />
      </Route>
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
