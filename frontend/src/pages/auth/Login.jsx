import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, LogIn, Globe, Facebook } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Isi semua kolom terlebih dahulu')
      return
    }
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Selamat datang kembali! 👋')
      navigate('/beranda')
    } catch (err) {
      toast.error(err.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    toast('Fitur ' + provider + ' belum tersedia.', { icon: '⚠️' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--gradient-hero)',
      }}
      className="bg-dots"
    >
      <div
        className="orb orb-pink"
        style={{ width: 400, height: 400, top: -100, right: -100, opacity: 0.4 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 350, height: 350, bottom: -80, left: -50, opacity: 0.35 }}
      />

      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-700)' }}>Portal KIA</h1>
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 999,
            margin: '0.5rem auto 0',
            background: 'linear-gradient(135deg, #E8307D, #f472b6)',
          }}
        />
      </div>

      <div
        className="glass-card animate-slideUp"
        style={{ width: '100%', maxWidth: 440, padding: '2.5rem', position: 'relative', zIndex: 1, marginTop: 60 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8307D, #f472b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(232,48,125,0.25)',
            }}
          >
            <User size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.35rem' }}>Selamat Datang</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 340, margin: '0 auto' }}>
            Silakan masuk untuk mengakses Portal Kesehatan Ibu dan Anak Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                className="form-input"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                id="login-email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              to="#"
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary-500)',
                fontWeight: 600,
              }}
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.95rem' }}
            disabled={loading}
            id="btn-login"
          >
            {loading ? (
              <span
                className="animate-spin"
                style={{
                  width: 18,
                  height: 18,
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            ) : (
              <>
                <LogIn size={16} /> Masuk
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          <div className="divider" />
          <span>Atau masuk dengan</span>
          <div className="divider" />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
            onClick={() => handleSocialLogin('Google')}
          >
            <Globe size={16} /> Google
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
            onClick={() => handleSocialLogin('Facebook')}
          >
            <Facebook size={16} /> Facebook
          </button>
        </div>

        <p
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          Belum punya akun?{' '}
          <Link to="/daftar" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
