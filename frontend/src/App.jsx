import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import { isAdminLoggedIn } from './lib/adminApi'

// Layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import ContentList from './pages/content/ContentList'
import ContentDetail from './pages/content/ContentDetail'
import QuizPage from './pages/quiz/QuizPage'
import GrowthTracker from './pages/growth/GrowthTracker'
import Profile from './pages/profile/Profile'
import Bookmarks from './pages/Bookmarks'
import GiziMenu from './pages/gizi/GiziMenu'
import PHBS from './pages/PHBS'
import KesehattanIbu from './pages/KesehattanIbu'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPengguna from './pages/admin/AdminPengguna'
import AdminParenting from './pages/admin/AdminAnak'  // Reuse Anak for Parenting
import AdminGizi from './pages/admin/AdminResep'  // Reuse Resep for Gizi
import AdminKesehatanIbu from './pages/admin/AdminKesehatanIbu'  // Wrapper for Kesehatan Ibu
import AdminPHBS from './pages/admin/AdminPHBS'  // Wrapper for PHBS
import AdminQuiz from './pages/admin/AdminQuiz'

// Guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (user) return <Navigate to="/beranda" replace />
  return children
}

function AdminRoute({ children }) {
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />
  return children
}

// Layout wrapper for non-admin pages
function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes – no Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/pengguna" element={<AdminRoute><AdminPengguna /></AdminRoute>} />
        <Route path="/admin/parenting" element={<AdminRoute><AdminParenting /></AdminRoute>} />
        <Route path="/admin/kesehatan-ibu" element={<AdminRoute><AdminKesehatanIbu /></AdminRoute>} />
        <Route path="/admin/phbs" element={<AdminRoute><AdminPHBS /></AdminRoute>} />
        <Route path="/admin/gizi" element={<AdminRoute><AdminGizi /></AdminRoute>} />
        <Route path="/admin/quiz" element={<AdminRoute><AdminQuiz /></AdminRoute>} />

        {/* Regular routes with Navbar/Footer */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/konten" element={<ContentList />} />
              <Route path="/konten/:slug" element={<ContentDetail />} />
              <Route path="/phbs" element={<PHBS />} />
              <Route path="/kesehatan-ibu" element={<KesehattanIbu />} />

              {/* Auth */}
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/daftar" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Protected */}
              <Route path="/beranda" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/kuis" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
              <Route path="/tumbuh-kembang" element={<ProtectedRoute><GrowthTracker /></ProtectedRoute>} />
              <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/bookmark" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/gizi-menu" element={<GiziMenu />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}
