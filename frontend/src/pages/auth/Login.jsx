import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
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
        if (!email || !password) { toast.error('Isi semua kolom terlebih dahulu'); return }
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

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
            background: 'var(--gradient-hero)',
        }} className="bg-dots">
            <div className="orb orb-pink" style={{ width: 400, height: 400, top: -100, right: -100, opacity: 0.4 }} />
            <div className="orb orb-purple" style={{ width: 350, height: 350, bottom: -80, left: -50, opacity: 0.35 }} />

            <div className="glass-card animate-slideUp" style={{ width: '100%', maxWidth: 440, padding: '2.5rem', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '14px',
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(236,72,153,0.35)',
                    }}>
                        <Heart size={24} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>Masuk ke KIA Edukasi</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Belum punya akun?{' '}
                        <Link to="/daftar" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Daftar gratis</Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email" className="form-input" placeholder="nama@email.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={{ paddingLeft: '2.75rem' }}
                                id="login-email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                                id="login-password"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }} disabled={loading} id="btn-login">
                        {loading ? <span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'block' }} />
                            : <><LogIn size={16} /> Masuk</>}
                    </button>
                </form>

                {/* Demo hint */}
                <div style={{
                    marginTop: '1.5rem', padding: '0.875rem', borderRadius: 'var(--radius-md)',
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        💡 Buat akun baru untuk mulai mengakses fitur lengkap platform KIA Edukasi
                    </p>
                </div>
            </div>
        </div>
    )
}
