import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Isi semua kolom terlebih dahulu')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Password tidak sama')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      toast.success('Akun berhasil dibuat! Silakan masuk. 🎉')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Gagal membuat akun')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Nama Lengkap', type: 'text', icon: User, placeholder: 'Nama Anda', id: 'reg-name' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'nama@email.com', id: 'reg-email' },
    { key: 'password', label: 'Kata Sandi', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', id: 'reg-password', toggleable: true },
    { key: 'confirm', label: 'Konfirmasi Kata Sandi', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', id: 'reg-confirm' },
  ]

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
        className="orb orb-teal"
        style={{ width: 400, height: 400, top: -100, left: -100, opacity: 0.35 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 350, height: 350, bottom: -80, right: -50, opacity: 0.3 }}
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
        style={{ width: '100%', maxWidth: 460, padding: '2.5rem', position: 'relative', zIndex: 1, marginTop: 60 }}
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.35rem' }}>Buat Akun Baru</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 340, margin: '0 auto' }}>
            Buat akun untuk mulai memantau pertumbuhan sang buah hati.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {fields.map(({ key, label, type, icon: Icon, placeholder, id, toggleable }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon
                  size={16}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type={type}
                  className="form-input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={update(key)}
                  style={{ paddingLeft: '2.75rem', paddingRight: toggleable ? '2.75rem' : undefined }}
                  id={id}
                />
                {toggleable && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }} disabled={loading} id="btn-register">
            {loading ? (
              <span
                className="animate-spin"
                style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'block' }}
              />
            ) : (
              <>
                <UserPlus size={16} /> Daftar Sekarang
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Sudah memiliki akun?{' '}
          <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
