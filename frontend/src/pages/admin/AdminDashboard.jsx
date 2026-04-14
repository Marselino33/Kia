import { useEffect, useState } from 'react';
import { Users, Baby, FileText, ChefHat, Brain, TrendingUp, Activity } from 'lucide-react';
import AdminLayout from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-dashboard.css';
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_pengguna: 0,
    total_anak: 0,
    total_content: 0,
    total_resep: 0,
    total_quiz: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adminApi.get('/admin/dashboard').then(r => {
      if (r.data?.data) setStats(r.data.data);
    }).catch(err => toast.error('Gagal memuat statistik')).finally(() => setLoading(false));
  }, []);
  const statCards = [{
    label: 'Total Pengguna',
    value: stats.total_pengguna,
    icon: Users,
    color: '#6366f1'
  }, {
    label: 'Data Anak',
    value: stats.total_anak,
    icon: Baby,
    color: '#E8307D'
  }, {
    label: 'Artikel Konten',
    value: stats.total_content,
    icon: FileText,
    color: '#0ea5e9'
  }, {
    label: 'Resep Gizi',
    value: stats.total_resep,
    icon: ChefHat,
    color: '#10b981'
  }, {
    label: 'Quiz',
    value: stats.total_quiz,
    icon: Brain,
    color: '#f59e0b'
  }];
  const StatCard = ({
    label,
    value,
    icon: Icon,
    color
  }) => <div className="isx-admindashboard-1">
            <div className="isx-admindashboard-2">
                <span className="isx-admindashboard-3">{label}</span>
                <Icon size={20} color={color} />
            </div>
            <p className="isx-admindashboard-4">{value || 0}</p>
        </div>;
  return <AdminLayout>
            <div className="isx-admindashboard-5">
                <h1 className="isx-admindashboard-6">
                    Selamat datang kembali, Admin!
                </h1>
                <p className="isx-admindashboard-7">
                    Berikut adalah ringkasan terbaru untuk performa sistem Portal KIA hari ini.
                </p>
            </div>
            {loading ? <div className="isx-admindashboard-8">
                    <Activity size={32} className="isx-admindashboard-9" />
                    <p>Memuat data...</p>
                </div> : <>
                    <div className="isx-admindashboard-10">
                        {statCards.map(s => <StatCard key={s.label} {...s} />)}
                    </div>

                    <div className="isx-admindashboard-11">
                        <div className="isx-admindashboard-12">
                            <TrendingUp size={20} color="#6366f1" />
                            <h2 className="isx-admindashboard-13">Status Sistem</h2>
                        </div>
                        <div className="isx-admindashboard-14">
                            {[{
            label: 'Backend API',
            status: 'Online',
            color: '#10b981'
          }, {
            label: 'Database Supabase',
            status: 'Terhubung',
            color: '#10b981'
          }, {
            label: 'Auth Service',
            status: 'Aktif',
            color: '#10b981'
          }].map(item => <div key={item.label} className="isx-admindashboard-16">
                                    <span className="isx-admindashboard-15">{item.label}</span>
                                    <span className="isx-admindashboard-17">
                                        {item.status}
                                    </span>
                                </div>)}
                        </div>
                    </div>
                </>}
        </AdminLayout>;
}