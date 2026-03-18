import { useEffect, useState } from 'react'
import { Users, Baby, FileText, ChefHat, Brain, Syringe, TrendingUp, Activity } from 'lucide-react'
import AdminLayout, { AdminPageHeader, StatCard } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_pengguna: 0, total_anak: 0, total_content: 0,
        total_resep: 0, total_quiz: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminApi.get('/admin/dashboard')
            .then(r => {
                if (r.data?.data) setStats(r.data.data)
            })
            .catch(err => toast.error('Gagal memuat statistik'))
            .finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: 'Total Pengguna', value: stats.total_pengguna, icon: Users, color: '#6366f1' },
        { label: 'Data Anak', value: stats.total_anak, icon: Baby, color: '#ec4899' },
        { label: 'Artikel Konten', value: stats.total_content, icon: FileText, color: '#0ea5e9' },
        { label: 'Resep Gizi', value: stats.total_resep, icon: ChefHat, color: '#10b981' },
        { label: 'Quiz', value: stats.total_quiz, icon: Brain, color: '#f59e0b' },
    ]

    return (
        <AdminLayout>
            <AdminPageHeader
                title="Dashboard"
                subtitle="Ringkasan statistik platform SEJIWA"
            />
            <div style={{ padding: '2rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <Activity size={32} style={{ marginBottom: '0.75rem' }} />
                        <p>Memuat data...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {statCards.map(s => (
                                <StatCard key={s.label} {...s} />
                            ))}
                        </div>

                        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <TrendingUp size={20} color="#6366f1" />
                                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Status Sistem</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                {[
                                    { label: 'Backend API', status: 'Online', color: '#10b981' },
                                    { label: 'Database Supabase', status: 'Terhubung', color: '#10b981' },
                                    { label: 'Auth Service', status: 'Aktif', color: '#10b981' },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        padding: '0.875rem 1rem', borderRadius: '0.75rem',
                                        background: item.color + '10', border: '1px solid ' + item.color + '30',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.color, background: item.color + '20', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}
