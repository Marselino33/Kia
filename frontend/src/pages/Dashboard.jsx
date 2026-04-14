import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Baby, Activity, Bookmark, ChevronRight, Clock, Sparkles, CheckCircle2, Mail, ShieldCheck, UserCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import '../styles/pages/dashboard.css';
const sampleArticles = [{
  id: 1,
  slug: 'nutrisi-ibu-hamil',
  title: 'Nutrisi Penting untuk Ibu Hamil',
  category: 'Kehamilan',
  readMinutes: 5,
  phase: 'kehamilan_1'
}, {
  id: 2,
  slug: 'imunisasi-dasar-bayi',
  title: 'Jadwal Imunisasi Dasar Bayi',
  category: 'Imunisasi',
  readMinutes: 7,
  phase: 'bayi'
}, {
  id: 3,
  slug: 'tanda-persalinan',
  title: 'Tanda-Tanda Persalinan yang Perlu Diketahui',
  category: 'Persalinan',
  readMinutes: 6,
  phase: 'persalinan'
}, {
  id: 4,
  slug: 'asi-eksklusif',
  title: 'Manfaat ASI Eksklusif untuk Bayi',
  category: 'Gizi',
  readMinutes: 5,
  phase: 'bayi'
}];
const focusItems = [{
  title: 'Lanjutkan membaca',
  description: 'Buka kembali artikel yang terakhir kamu simpan atau baca.',
  to: '/konten',
  color: '#2563eb',
  icon: BookOpen
}, {
  title: 'Mulai kuis cepat',
  description: 'Uji pemahamanmu tentang gizi, kehamilan, dan parenting.',
    to: '/kuis-parenting',
  color: '#0f766e',
  icon: Activity
}, {
  title: 'Cek bookmark',
  description: 'Semua bacaan tersimpan ada di satu tempat.',
  to: '/bookmark',
  color: '#7c3aed',
  icon: Bookmark
}];
function StatCard({
  icon: Icon,
  value,
  label,
    color,
    iconClass
}) {
  return <div className="glass-card dashboard-stat-card">
                        <div className={`dashboard-stat-icon ${iconClass}`}>
                <Icon size={22} color={color} />
            </div>
            <div>
                <div className="dashboard-stat-value">{value}</div>
                <div className="dashboard-stat-label">{label}</div>
            </div>
        </div>;
}
export default function Dashboard() {
  const {
    user
  } = useAuthStore();
  const [articles, setArticles] = useState(sampleArticles.slice(0, 3));
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Ibu';
    const displayName = user?.user_metadata?.full_name || 'Pengguna KIA';
    const displayEmail = user?.email || '-';
    const displayRole = user?.user_metadata?.role || 'ibu';
  useEffect(() => {
    let mounted = true;
    Promise.all([api.get('/content?limit=3').then(r => r.data?.data || sampleArticles.slice(0, 3)).catch(() => sampleArticles.slice(0, 3)), api.get('/bookmarks').then(r => r.data?.data || []).catch(() => [])]).then(([contentData, bookmarkData]) => {
      if (!mounted) return;
      setArticles(contentData);
      setBookmarks(bookmarkData);
      setLoadingArticles(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const phaseColors = {
    kehamilan_1: '#E8307D',
    kehamilan_2: '#8b5cf6',
    kehamilan_3: '#06b6d4',
    persalinan: '#f59e0b',
    bayi: '#14b8a6',
    balita: '#10b981'
  };
  return <div className="dashboard-page">
            <div className="container dashboard-container">
                <div className="dashboard-head-row">
                    <div>
                        <div className="dashboard-pill">
                            <Sparkles size={14} /> Ringkasan Personal
                        </div>
                        <h1 className="dashboard-title">
                            Halo, <span className="gradient-text">{firstName}!</span>
                        </h1>
                        <p className="dashboard-subtitle">
                            Pantau aktivitasmu, lanjutkan bacaan terakhir, dan akses fitur utama akunmu dari halaman pengguna.
                        </p>
                    </div>

                    <div className="dashboard-head-actions">
                        <Link to="/konten" className="dashboard-action-primary">
                            Baca Konten <ChevronRight size={16} />
                        </Link>
                        <Link to="/bookmark" className="dashboard-action-secondary">
                            Bookmark
                        </Link>
                    </div>
                </div>

                <div className="dashboard-user-overview glass-card">
                    <div className="dashboard-user-avatar">
                        <UserCircle2 size={38} color="#2563eb" />
                    </div>
                    <div className="dashboard-user-main">
                        <p className="dashboard-user-label">Data Pengguna Login</p>
                        <h2 className="dashboard-user-name">{displayName}</h2>
                        <div className="dashboard-user-meta">
                            <span><Mail size={14} /> {displayEmail}</span>
                            <span><ShieldCheck size={14} /> Role: {displayRole}</span>
                        </div>
                    </div>
                    <Link to="/profil" className="dashboard-user-profile-link">Kelola Profil</Link>
                </div>

                <div className="grid-4 dashboard-stats-grid">
                    <StatCard icon={BookOpen} value={loadingArticles ? '...' : articles.length} label="Bacaan Tersedia" color="#2563eb" iconClass="dashboard-stat-icon-blue" />
                    <StatCard icon={Bookmark} value={bookmarks.length} label="Tersimpan" color="#7c3aed" iconClass="dashboard-stat-icon-purple" />
                    <StatCard icon={Activity} value="0" label="Kuis Selesai" color="#0f766e" iconClass="dashboard-stat-icon-teal" />
                    <StatCard icon={Baby} value="0" label="Data Anak" color="#f59e0b" iconClass="dashboard-stat-icon-amber" />
                </div>

                <div className="dashboard-quick-wrap">
                    <h2 className="dashboard-section-title">Aksi Cepat</h2>
                    <div className="dashboard-quick-grid">
                        {focusItems.map(({
            to,
            title,
            description,
            color,
            icon: Icon
          }) => <Link key={to} to={to} className="glass-card dashboard-quick-card">
                                                                <div className={color === '#2563eb' ? 'dashboard-quick-icon dashboard-quick-icon-blue' : color === '#0f766e' ? 'dashboard-quick-icon dashboard-quick-icon-teal' : 'dashboard-quick-icon dashboard-quick-icon-purple'}>
                                    <Icon size={20} color={color} />
                                </div>
                                <div>
                                    <h3 className="dashboard-quick-title">{title}</h3>
                                    <p className="dashboard-quick-desc">{description}</p>
                                </div>
                            </Link>)}
                    </div>
                </div>

                <div className="dashboard-main-grid">
                    <div className="glass-card dashboard-reco-card">
                        <div className="dashboard-reco-head">
                            <div>
                                <h2 className="dashboard-reco-title">Rekomendasi Bacaan</h2>
                                <p className="dashboard-reco-subtitle">3 artikel terbaru yang bisa langsung dibaca.</p>
                            </div>
                            <Link to="/konten" className="dashboard-reco-link">
                                Lihat Semua <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="dashboard-reco-list">
                            {articles.map(a => <Link key={a.id} to={`/konten/${a.slug}`} className="glass-card dashboard-reco-item">
                                                                        <div className={`dashboard-phase-icon dashboard-phase-${a.phase || 'default'}`}>
                                        <BookOpen size={18} color={phaseColors[a.phase] || '#2563eb'} />
                                    </div>
                                    <div className="dashboard-reco-item-content">
                                        <div className="dashboard-reco-meta">
                                            <span className="badge badge-pink dashboard-category-badge">{a.category}</span>
                                            <span className="dashboard-reco-time">
                                                <Clock size={11} /> {a.readMinutes} menit baca
                                            </span>
                                        </div>
                                        <h3 className="dashboard-reco-item-title">{a.title}</h3>
                                    </div>
                                </Link>)}
                        </div>
                    </div>

                    <div className="dashboard-side-col">
                        <div className="glass-card dashboard-focus-card">
                            <div className="dashboard-focus-head">
                                <CheckCircle2 size={16} color="#2563eb" />
                                <h3 className="dashboard-focus-title">Fokus Minggu Ini</h3>
                            </div>
                            <p className="dashboard-focus-desc">
                                Selesaikan 1 kuis dan simpan 2 artikel yang paling relevan untuk kamu.
                            </p>
                        </div>

                        <div className="glass-card dashboard-status-card">
                            <h3 className="dashboard-status-title">Status Singkat</h3>
                            <div className="dashboard-status-row">
                                <span className="dashboard-status-label">Bookmark tersimpan</span>
                                <span className="dashboard-status-value purple">{bookmarks.length}</span>
                            </div>
                            <div className="dashboard-status-row">
                                <span className="dashboard-status-label">Artikel tampil</span>
                                <span className="dashboard-status-value blue">{articles.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
}
