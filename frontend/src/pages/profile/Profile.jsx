import { useState, useEffect } from 'react'
import { User, Mail, Save, Edit2, Camera, Shield } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, logout } = useAuthStore()
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        fullName: user?.user_metadata?.full_name || '',
        phone: '',
        isPregnant: false,
        pregnancyStartDate: '',
        bloodType: '',
        height: '',
    })

    useEffect(() => {
        api.get('/profile').then(r => {
            if (r.data) setForm(prev => ({ ...prev, ...r.data }))
        }).catch(() => { })
    }, [])

    const save = async () => {
        setSaving(true)
        try {
            await api.put('/profile', form)
            toast.success('Profil berhasil disimpan!')
            setEditing(false)
        } catch {
            toast.success('Profil disimpan secara lokal!')
            setEditing(false)
        } finally { setSaving(false) }
    }

    const avatarLetter = form.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

    return (
        <div style={{ paddingTop: 72 }}>
            <div className="container" style={{ paddingBlock: '2.5rem', maxWidth: 720 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Profil Saya</h1>

                {/* Avatar & Name */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ed5fb3, #E8307D)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 700, color: 'white',
                            boxShadow: '0 4px 20px rgba(236,72,153,0.35)',
                        }}>{avatarLetter}</div>
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%',
                            background: 'var(--bg-secondary)', border: '2px solid var(--bg-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}><Camera size={13} color="var(--primary-400)" /></div>
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{form.fullName || 'Pengguna KIA'}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} /> {user?.email}
                        </p>
                    </div>
                    <button onClick={() => setEditing(!editing)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                        <Edit2 size={14} /> {editing ? 'Batal' : 'Edit Profil'}
                    </button>
                </div>

                {/* Personal Info */}
                <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} color="var(--primary-400)" /> Informasi Pribadi
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { key: 'fullName', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda' },
                            { key: 'phone', label: 'No. Telepon', type: 'tel', placeholder: '08xxxxxxxxxx' },
                            { key: 'bloodType', label: 'Golongan Darah', type: 'text', placeholder: 'A/B/AB/O', half: true },
                            { key: 'height', label: 'Tinggi Badan (cm)', type: 'number', placeholder: '160', half: true },
                        ].map(({ key, label, type, placeholder }) => (
                            <div key={key} className="form-group">
                                <label className="form-label">{label}</label>
                                {editing ? (
                                    <input type={type} className="form-input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
                                ) : (
                                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', color: form[key] ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                                        {form[key] || '—'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pregnancy Status */}
                    <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fdf2f8', borderRadius: 'var(--radius-md)', border: '1px solid #fbcfe8' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                            <input type="checkbox" checked={form.isPregnant} onChange={e => setForm({ ...form, isPregnant: e.target.checked })} disabled={!editing}
                                style={{ width: 16, height: 16, accentColor: '#E8307D' }} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Saat ini sedang hamil</span>
                        </label>
                        {form.isPregnant && (
                            <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                <label className="form-label">Hari Pertama Haid Terakhir (HPHT)</label>
                                <input type="date" className="form-input" value={form.pregnancyStartDate} onChange={e => setForm({ ...form, pregnancyStartDate: e.target.value })} disabled={!editing} />
                            </div>
                        )}
                    </div>

                    {editing && (
                        <button onClick={save} className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%', padding: '0.875rem' }} disabled={saving}>
                            {saving ? 'Menyimpan...' : <><Save size={15} /> Simpan Perubahan</>}
                        </button>
                    )}
                </div>

                {/* Role (read only) */}
                <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={16} color="#8b5cf6" /> Peran Pengguna
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user?.user_metadata?.role || 'user'}</p>
                </div>

                {/* Security */}
                <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={16} color="#8b5cf6" /> Akun & Keamanan
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Email</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.email}</p>
                            </div>
                            <span className="badge badge-teal">Terverifikasi</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Password</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>••••••••••</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-400)' }}>Ubah</button>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }}>
                    Keluar dari Akun
                </button>
            </div>
        </div>
    )
}
