import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react'
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
        if (!form.name || !form.email || !form.password) { toast.error('Isi semua kolom terlebih dahulu'); return }
        if (form.password !== form.confirm) { toast.error('Password tidak sama'); return }
        if (form.password.length < 8) { toast.error('Password minimal 8 karakter'); return }
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
        { key: 'password', label: 'Password', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', id: 'reg-password', toggleable: true },
        { key: 'confirm', label: 'Konfirmasi Password', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', id: 'reg-confirm' },
    ]

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
            background: 'var(--gradient-hero)',
        }} className="bg-dots">
            <div className="orb orb-teal" style={{ width: 400, height: 400, top: -100, left: -100, opacity: 0.35 }} />
            <div className="orb orb-purple" style={{ width: 350, height: 350, bottom: -80, right: -50, opacity: 0.3 }} />

            <div className="glass-card animate-slideUp" style={{ width: '100%', maxWidth: 460, padding: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '14px',
                        background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(20,184,166,0.35)',
                    }}>
                        <Heart size={24} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>Buat Akun Baru</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Sudah punya akun?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Masuk</Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {fields.map(({ key, label, type, icon: Icon, placeholder, id, toggleable }) => (
                        <div key={key} className="form-group">
                            <label className="form-label">{label}</label>
                            <div style={{ position: 'relative' }}>
                                <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type={type} className="form-input" placeholder={placeholder}
                                    value={form[key]} onChange={update(key)}
                                    style={{ paddingLeft: '2.75rem', paddingRight: toggleable ? '2.75rem' : undefined }}
                                    id={id}
                                />
                                {toggleable && (
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }} disabled={loading} id="btn-register">
                        {loading
                            ? <span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'block' }} />
                            : <><UserPlus size={16} /> Daftar Sekarang</>}
                    </button>
                </form>

                <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Dengan mendaftar, Anda menyetujui syarat & ketentuan KIA Edukasi Digital
                </p>
            </div>
        </div>
    )
}
