import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import KesehattanIbu from './pages/KesehattanIbu'
import MentalHealthCheck from './pages/mental-orang-tua/MentalHealthCheck'
import StimulusAnak from './pages/parenting/StimulusAnak'
import PolaAsuhAnak from './pages/parenting/PolaAsuhAnak'
import PolaAsuhDetail from './pages/parenting/PolaAsuhDetail'
import KuisParenting from './pages/parenting/KuisParenting'
import ParentingQuizPlay from './pages/parenting/ParentingQuizPlay'
import GiziIbuTrimester1 from './pages/gizi/GiziIbuTrimester1'
import GiziAnak from './pages/gizi/GiziAnak'
import ResepMPASI from './pages/gizi/ResepMPASI'
import GiziAnakDetail from './pages/gizi/GiziAnakDetail'
import GiziIbuTrimesterDetail from './pages/gizi/GiziIbuTrimesterDetail'
import ResepMPASIDetail from './pages/gizi/ResepMPASIDetail'
import KesehatanMental from './pages/mental-orang-tua/KesehatanMental'
import MentalContentDetail from './pages/mental-orang-tua/MentalContentDetail'
import StimulusDetail from './pages/parenting/StimulusDetail'
import InformasiUmum from './pages/informasi-umum/InformasiUmum'
import InformasiUmumDetail from './pages/informasi-umum/InformasiUmumDetail'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPengguna from './pages/admin/AdminPengguna'
import AdminQuiz from './pages/admin/AdminQuiz'
import AdminParenting from './pages/admin/AdminParenting'
import AdminPolaAsuh from './pages/admin/AdminPolaAsuh'
import AdminGiziIbu from './pages/admin/AdminGiziIbu'
import AdminGiziAnak from './pages/admin/AdminGiziAnak'
import AdminMPASI from './pages/admin/AdminMPASI'
import AdminMental from './pages/admin/AdminMental'
import AdminInformasi from './pages/admin/AdminInformasi'

// Guards
function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (!user && !isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          intendedPath: location.pathname,
          reason: 'protected'
        }}
      />
    )
  }
  return children
}

function GuestRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (user) return <Navigate to="/user/pengguna" replace />
  return children
}

function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const isAdmin = user?.user_metadata?.role === 'admin'

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />
  // server side middleware / admin api already valid, but we also check app state when available
  if (!isAdmin) return <Navigate to="/login" replace />
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
        <Route path="/admin/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/daftar" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/pengguna" element={<AdminRoute><AdminPengguna /></AdminRoute>} />
        <Route path="/admin/parenting" element={<AdminRoute><AdminParenting /></AdminRoute>} />
        <Route path="/admin/pola-asuh" element={<AdminRoute><AdminPolaAsuh /></AdminRoute>} />
        <Route path="/admin/gizi" element={<Navigate to="/admin/gizi-ibu" replace />} />
        <Route path="/admin/kesehatan-ibu" element={<Navigate to="/admin/mental-orang-tua" replace />} />
        <Route path="/admin/phbs" element={<Navigate to="/admin/informasi-umum" replace />} />
        <Route path="/admin/gizi-ibu" element={<AdminRoute><AdminGiziIbu /></AdminRoute>} />
        <Route path="/admin/gizi-anak" element={<AdminRoute><AdminGiziAnak /></AdminRoute>} />
        <Route path="/admin/mpasi" element={<AdminRoute><AdminMPASI /></AdminRoute>} />
        <Route path="/admin/mental-orang-tua" element={<AdminRoute><AdminMental /></AdminRoute>} />
        <Route path="/admin/informasi-umum" element={<AdminRoute><AdminInformasi /></AdminRoute>} />
        <Route path="/admin/quiz" element={<AdminRoute><AdminQuiz /></AdminRoute>} />

        {/* Regular routes with Navbar/Footer */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/konten" element={<ContentList />} />
              <Route path="/konten/:slug" element={<ContentDetail />} />
              <Route path="/informasi-umum" element={<InformasiUmum />} />
              <Route path="/informasi-umum/:slug" element={<InformasiUmumDetail />} />
              <Route path="/phbs" element={<Navigate to="/informasi-umum" replace />} />
              <Route path="/kesehatan-ibu" element={<KesehattanIbu />} />

              {/* Protected */}
              <Route path="/user/pengguna" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/beranda" element={<Landing />} />
              <Route path="/dashboard" element={<Navigate to="/user/pengguna" replace />} />
              <Route path="/mental-health" element={<KesehatanMental />} />
              <Route path="/mental-health/:slug" element={<MentalContentDetail />} />
              <Route path="/mental-content-detail/:slug" element={<MentalContentDetail />} />
              <Route path="/mental-health-check" element={<ProtectedRoute><MentalHealthCheck /></ProtectedRoute>} />
              <Route path="/kuis" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
              <Route path="/tumbuh-kembang" element={<ProtectedRoute><GrowthTracker /></ProtectedRoute>} />
              <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/bookmark" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              
              {/* Gizi Menu - Alias ke Resep MPASI */}
              <Route path="/gizi-menu" element={<ResepMPASI />} />
              <Route path="/gizi/:slug" element={<ContentDetail />} />
              
              {/* Parenting - Stimulus Anak */}
              <Route path="/stimulus" element={<StimulusAnak />} />
              <Route path="/stimulus/:slug" element={<StimulusDetail />} />

              {/* Parenting - Pola Asuh Anak */}
              <Route path="/pola-asuh" element={<PolaAsuhAnak />} />
              <Route path="/pola-asuh/:id" element={<PolaAsuhDetail />} />

              {/* Parenting - Kuis Pemahaman */}
              <Route path="/kuis-parenting" element={<ProtectedRoute><KuisParenting /></ProtectedRoute>} />
              <Route path="/kuis-parenting/main/:topicId" element={<ProtectedRoute><ParentingQuizPlay /></ProtectedRoute>} />
              <Route path="/kuis-parenting/konten/:feature/:contentSlug" element={<ProtectedRoute><ParentingQuizPlay /></ProtectedRoute>} />

              {/* Gizi - Ibu Hamil & Menyusui */}
              <Route path="/gizi-ibu-trimester1" element={<GiziIbuTrimester1 />} />
              <Route path="/gizi-ibu-trimester1/:stage/:itemId" element={<GiziIbuTrimesterDetail />} />
              <Route path="/kesehatan-ibu/*" element={<KesehattanIbu />} />

              {/* Gizi - Anak */}
              <Route path="/gizi-anak" element={<GiziAnak />} />
              <Route path="/gizi-anak/:age/:itemId" element={<GiziAnakDetail />} />

              {/* Gizi - Resep MPASI */}
              <Route path="/resep-mpasi" element={<ResepMPASI />} />
              <Route path="/resep-mpasi/:slug" element={<ResepMPASIDetail />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}
