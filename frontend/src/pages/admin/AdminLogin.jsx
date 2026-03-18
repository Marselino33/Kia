import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { setAdminToken } from '../../lib/adminApi'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1'

export default function AdminLogin() {
    const [noHp, setNoHp] = useState('')
    const [pin, setPin] = useState('')
    const [showPin, setShowPin] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Demo admin login
    const handleDemoLogin = () => {
        const demoToken = 'demo-admin-token-' + Date.now()
        setAdminToken(demoToken)
        toast.success('Login demo admin berhasil! 🛡️')
        navigate('/admin')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!noHp || !pin) { toast.error('Isi semua kolom terlebih dahulu'); return }
        setLoading(true)
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, { no_hp: noHp, pin })
            const token = res.data?.data?.access_token
            if (!token) throw new Error('Token tidak ditemukan')
            // Verify admin role
            const role = res.data?.data?.role
            if (role !== 'admin') throw new Error('Akun ini bukan admin')
            setAdminToken(token)
            toast.success('Login admin berhasil! 🛡️')
            navigate('/admin')
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Login gagal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        }}>
            <div style={{
                width: '100%', maxWidth: 440, padding: '2.5rem',
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '14px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                    }}>
                        <Shield size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>
                        Admin Panel
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                        SEJIWA – Portal Edukasi KIA
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
                            Nomor HP
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                            <input
                                type="text" placeholder="08123456789"
                                value={noHp} onChange={e => setNoHp(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '0.75rem', color: 'white', fontSize: '0.9rem', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
                            PIN (6 digit)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                            <input
                                type={showPin ? 'text' : 'password'} placeholder="••••••"
                                value={pin} onChange={e => setPin(e.target.value)}
                                maxLength={6}
                                style={{
                                    width: '100%', padding: '0.75rem 2.75rem',
                                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '0.75rem', color: 'white', fontSize: '0.9rem', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button type="button" onClick={() => setShowPin(!showPin)}
                                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        marginTop: '0.5rem', padding: '0.875rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', borderRadius: '0.75rem', color: 'white',
                        fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? <span style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'block', animation: 'spin 1s linear infinite' }} />
                            : <><LogIn size={16} /> Masuk Admin</>}
                    </button>
                </form>

                {/* Demo login */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '0.75rem' }}>
                        💡 Mode Demo: Login langsung tanpa akun
                    </p>
                    <button onClick={handleDemoLogin} style={{
                        width: '100%', padding: '0.6rem',
                        background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.5)',
                        borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem',
                        cursor: 'pointer', fontWeight: 500
                    }}>
                        🚀 Demo Admin Login
                    </button>
                </div>
            </div>
        </div>
    )
}
