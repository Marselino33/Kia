import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import '../../styles/pages/parenting-stimulus-anak.css';

export default function StimulusAnak() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(8);
  const [error, setError] = useState('');

  const ageRanges = [
    { id: 'all', label: 'Lihat Semua' },
    { id: 'bayi-1', label: 'Bayi 29 hari - 3 bulan' },
    { id: 'bayi-2', label: '3-6 bulan' },
    { id: 'bayi-3', label: '6-9 bulan' },
    { id: 'bayi-4', label: '9-12 bulan' },
    { id: 'bayi-5', label: '12-18 bulan' },
    { id: 'bayi-6', label: '18-24 bulan' },
    { id: 'toddler', label: '2-3 tahun' },
  ];

  const categoryBadgeColors = {
    'motorik-kasar': { bg: '#fef3c7', text: '#92400e', label: 'MOTORIK KASAR' },
    'sensorik': { bg: '#e0e7ff', text: '#312e81', label: 'SENSORIK' },
    'kognitif': { bg: '#1e293b', text: '#ffffff', label: 'KOGNITIF & BAHASA' },
    'motorik-halus': { bg: '#164e63', text: '#ffffff', label: 'MOTORIK HALUS' },
    'sosial': { bg: '#134e4a', text: '#ffffff', label: 'SOSIAL EMOSIONAL' },
    'visual': { bg: '#1e3a8a', text: '#ffffff', label: 'VISUAL' },
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/parenting');
        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
        const mapped = rows.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.judul,
          category: (item.kategori || 'stimulus_anak').toLowerCase().replace(/\s+/g, '-'),
          ageRange: item.phase || 'all',
          readTime: `${item.read_minutes || 5} menit`,
          image: item.gambar_url || 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
        }));
        setActivities(mapped);
      } catch {
        setError('Gagal memuat aktivitas parenting');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (selectedAgeRange === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((activity) => activity.ageRange === selectedAgeRange));
    }
  }, [selectedAgeRange, activities]);

  const displayedActivities = filteredActivities.slice(0, displayCount);
  const hasMore = displayedActivities.length < filteredActivities.length;

  const handleLoadMore = () => {
    setDisplayCount(displayCount + 8);
  };

  const handleActivityClick = (activitySlug) => {
    navigate(`/stimulus/${activitySlug}`);
  };

  return (
      <main className="stimulus-page">
        {/* Breadcrumb */}
        <div className="stimulus-container stimulus-breadcrumb-wrap">
          <div className="stimulus-breadcrumb">
            <span onClick={() => navigate('/')} className="stimulus-breadcrumb-link">
              Beranda
            </span>
            <span className="stimulus-breadcrumb-sep">/</span>
            <span className="stimulus-breadcrumb-current-link">Parenting</span>
            <span className="stimulus-breadcrumb-sep">/</span>
            <span>Stimulus Anak</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="stimulus-container stimulus-head">
          <h1 className="stimulus-title">
            Optimalkan Tumbuh Kembang Si Kecil
          </h1>
          <p className="stimulus-subtitle">
            Temukan berbagai aktivitas stimulasi yang dirancang khusus oleh ahli untuk mendukung aspek motorik, sensorik, dan kognitif anak sesuai usianya.
          </p>
        </div>

        {/* Age Range Filter */}
        <div className="stimulus-container stimulus-filter-wrap">
          <div className="stimulus-filter-grid">
            {ageRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedAgeRange(range.id)}
                className={`stimulus-filter-btn ${selectedAgeRange === range.id ? 'active' : ''}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="stimulus-container stimulus-loading-wrap">
            <p className="stimulus-loading-text">Memuat aktivitas...</p>
          </div>
        ) : error ? (
          <div className="stimulus-container stimulus-loading-wrap">
            <p className="stimulus-loading-text">{error}</p>
          </div>
        ) : (
          <>
            <div className="stimulus-container stimulus-activity-grid">
              {displayedActivities.map((activity) => {
                const categoryInfo = categoryBadgeColors[activity.category];
                return (
                  <div
                    key={activity.id || activity.slug}
                    onClick={() => handleActivityClick(activity.slug)}
                    className="stimulus-card"
                  >
                    {/* Image */}
                    <div className="stimulus-card-image-wrap">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="stimulus-card-image"
                      />
                      {/* Category Badge */}
                      <div className={`stimulus-category-badge stimulus-category-badge-${activity.category}`}>
                        {(categoryInfo && categoryInfo.label) || (activity.category || 'PARENTING').toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="stimulus-card-body">
                      <div className="stimulus-meta">
                        <span>⏱</span>
                        <span>{activity.readTime}</span>
                      </div>
                      <h3 className="stimulus-card-title">
                        {activity.title}
                      </h3>
                      <div className="stimulus-card-foot">
                        <span className="stimulus-age-label">
                          {(() => {
                            const label = ageRanges.find(r => r.id === activity.ageRange)?.label || activity.ageRange || '';
                            return label.split('-')[0].trim();
                          })()}
                        </span>
                        <div className="stimulus-card-actions">
                          <button className="stimulus-read-btn">
                            Pelajari <ChevronRight size={16} />
                          </button>
                          <button
                            type="button"
                            className="stimulus-quiz-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/kuis-parenting/konten/parenting/${activity.slug || activity.id}`);
                            }}
                          >
                            Kuis Materi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="stimulus-load-wrap">
                <button
                  onClick={handleLoadMore}
                  className="stimulus-load-btn"
                >
                  Muat Lebih Banyak Aktivitas
                </button>
              </div>
            )}
          </>
        )}
      </main>
  );
}
