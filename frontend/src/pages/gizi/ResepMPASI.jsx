import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3 } from 'lucide-react';
import '../../styles/pages/gizi-resep-mpasi.css'

const tabs = [
  { key: '6-8', label: 'MPASI 6-8 Bulan' },
  { key: '9-11', label: 'MPASI 9-11 Bulan' },
  { key: '12-23', label: 'MPASI 12-23 Bulan' },
];

const recipesByStage = {
  '6-8': [
    {
      id: 1,
      slug: 'tim-hati-ayam-wortel',
      title: 'Bubur Lumat Hati Ayam & Wortel',
      duration: '25 Menit',
      image:
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Zat Besi Tinggi', 'Vitamin A'],
      label: 'TERLARIS',
    },
    {
      id: 2,
      slug: 'puree-labu-siam-daging',
      title: 'Puree Labu Siam & Daging Sapi',
      duration: '15 Menit',
      image:
        'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Protein Hewani', 'Serat'],
      label: 'MUDAH',
    },
    {
      id: 3,
      slug: 'bubur-susu-alpukat',
      title: 'Bubur Susu Alpukat Gurih',
      duration: '10 Menit',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      tags: ['Lemak Sehat', 'Omega-3'],
      label: '',
    },
    {
      id: 4,
      slug: 'bubur-ikan-kembung-bayam',
      title: 'Bubur Ikan Kembung & Bayam',
      duration: '30 Menit',
      image:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
      tags: ['DHA Tinggi', 'Kalsium'],
      label: '',
    },
    {
      id: 5,
      slug: 'puree-pisang-apel',
      title: 'Puree Pisang Apel & Kayu Manis',
      duration: '10 Menit',
      image:
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
      tags: ['Energi', 'Antioksidan'],
      label: '',
    },
    {
      id: 6,
      slug: 'bubur-telur-puyuh-tahu',
      title: 'Bubur Telur Puyuh & Tahu Sutra',
      duration: '20 Menit',
      image:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
      tags: ['Zink', 'Protein Nabati'],
      label: '',
    },
  ],
  '9-11': [
    {
      id: 7,
      slug: 'tim-beras-merah-ayam',
      title: 'Tim Beras Merah Ayam Kampung',
      duration: '30 Menit',
      image:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
      tags: ['Energi', 'Zat Besi'],
      label: 'POPULER',
    },
    {
      id: 8,
      slug: 'nasi-lunak-ikan-kuning',
      title: 'Nasi Lunak Ikan Kuah Kuning',
      duration: '28 Menit',
      image:
        'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=1200&q=80',
      tags: ['DHA', 'Protein'],
      label: '',
    },
    {
      id: 9,
      slug: 'finger-food-kentang-keju',
      title: 'Finger Food Kentang Keju Kukus',
      duration: '18 Menit',
      image:
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
      tags: ['Kalori', 'Kalsium'],
      label: 'MUDAH',
    },
  ],
  '12-23': [
    {
      id: 10,
      slug: 'nasi-goreng-sayur-anak',
      title: 'Nasi Goreng Sayur Anak',
      duration: '15 Menit',
      image:
        'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Serat', 'Vitamin'],
      label: 'TERBARU',
    },
    {
      id: 11,
      slug: 'sup-krim-jagung-ayam',
      title: 'Sup Krim Jagung Ayam',
      duration: '25 Menit',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      tags: ['Protein', 'Energi'],
      label: '',
    },
    {
      id: 12,
      slug: 'pasta-bolognaise-tahu',
      title: 'Pasta Bolognaise Tahu',
      duration: '22 Menit',
      image:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
      tags: ['Zat Besi', 'Karbohidrat'],
      label: '',
    },
  ],
};

export default function ResepMPASI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('6-8');

  const recipes = useMemo(() => recipesByStage[activeTab] || [], [activeTab]);

  return (
    <section className="resep-mpasi-page">
      <div className="resep-mpasi-container">
        <div className="resep-mpasi-breadcrumb">
          <span onClick={() => navigate('/beranda')} className="resep-mpasi-link">Beranda</span>
          <span className="resep-mpasi-sep">/</span>
          <span>Gizi</span>
          <span className="resep-mpasi-sep">/</span>
          <span className="resep-mpasi-breadcrumb-current">Resep MPASI</span>
        </div>

        <h1 className="resep-mpasi-title">
          Panduan Gizi Anak 0-6 Bulan
        </h1>
        <p className="resep-mpasi-subtitle">
          Temukan panduan MPASI yang dirancang khusus oleh ahli gizi
          untuk mendukung periode pertumbuhan krusial si kecil.
        </p>

        <div className="resep-mpasi-tab-row">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`resep-mpasi-tab-btn ${activeTab === tab.key ? 'is-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="resep-mpasi-head-row">
          <h2 className="resep-mpasi-section-title">Koleksi Resep {activeTab} Bulan</h2>
          <div className="resep-mpasi-chip-row">
            <button type="button" className="resep-mpasi-chip resep-mpasi-chip-primary">
              Populer
            </button>
            <button type="button" className="resep-mpasi-chip resep-mpasi-chip-secondary">
              Terbaru
            </button>
          </div>
        </div>

        <div className="recipe-grid resep-mpasi-grid">
          {recipes.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/resep-mpasi/${item.slug}`)}
              className="resep-mpasi-card"
            >
              <div className="resep-mpasi-card-media">
                <img src={item.image} alt={item.title} className="resep-mpasi-card-img" />
                {item.label ? (
                  <span className="resep-mpasi-label-badge">
                    {item.label}
                  </span>
                ) : null}
              </div>

              <div className="resep-mpasi-card-body">
                <p className="resep-mpasi-duration">
                  <Clock3 size={12} /> {item.duration}
                </p>
                <h3 className="resep-mpasi-card-title">{item.title}</h3>
                <div className="resep-mpasi-tag-row">
                  {item.tags.map((tag) => (
                    <span key={tag} className="resep-mpasi-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="resep-mpasi-footer-action">
          <button
            type="button"
            className="resep-mpasi-more-btn"
          >
            Tampilkan Lebih Banyak Resep
          </button>
        </div>
      </div>

    </section>
  );
}
