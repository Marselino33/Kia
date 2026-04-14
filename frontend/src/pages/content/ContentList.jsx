import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import '../../styles/pages/content-content-list.css'

export default function ContentList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Semua Konten' },
    { id: 'pola-asuh', label: 'Pola Asuh' },
    { id: 'stimulasi', label: 'Stimulasi Anak' },
    { id: 'nutrisi', label: 'Nutrisi' },
    { id: 'kesehatan', label: 'Kesehatan' },
    { id: 'perkembangan', label: 'Perkembangan' },
  ];

  // Sample data
  const sampleContents = [
    {
      id: 1,
      slug: 'teknik-pola-asuh-modern',
      title: 'Teknik Pola Asuh Modern untuk Anak Usia Dini',
      category: 'pola-asuh',
      excerpt: 'Pelajari teknik pola asuh yang efektif dan positif untuk mendukung perkembangan anak.',
      readTime: '8 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-15',
    },
    {
      id: 2,
      slug: 'stimulasi-bayi-3-bulan',
      title: 'Stimulasi yang Tepat untuk Bayi 3 Bulan',
      category: 'stimulasi',
      excerpt: 'Panduan lengkap stimulasi motorik dan sensorik untuk bayi usia 3 bulan.',
      readTime: '10 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-14',
    },
    {
      id: 3,
      slug: 'nutrisi-optimal-ibu-hamil',
      title: 'Nutrisi Optimal Saat Hamil',
      category: 'nutrisi',
      excerpt: 'Kebutuhan nutrisi penting untuk ibu hamil dan perkembangan janin yang sehat.',
      readTime: '12 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-13',
    },
    {
      id: 4,
      slug: 'vaksinasi-lengkap-anak',
      title: 'Jadwal Vaksinasi Lengkap untuk Anak',
      category: 'kesehatan',
      excerpt: 'Informasi lengkap tentang jadwal dan jenis vaksinasi yang direkomendasikan.',
      readTime: '15 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-12',
    },
    {
      id: 5,
      slug: 'tahap-perkembangan-anak',
      title: 'Tahap Perkembangan Anak 0-3 Tahun',
      category: 'perkembangan',
      excerpt: 'Memahami milestone perkembangan anak dari lahir hingga 3 tahun.',
      readTime: '18 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-11',
    },
    {
      id: 6,
      slug: 'bonding-ibu-bayi',
      title: 'Membangun Bonding dengan Bayi Sejak Dini',
      category: 'pola-asuh',
      excerpt: 'Cara membangun ikatan emosional yang kuat dengan bayi Anda.',
      readTime: '7 menit',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
      date: '2024-01-10',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setContents(sampleContents);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = contents;

    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContents(result);
  }, [selectedCategory, searchTerm, contents]);


  return (
    <main className="content-list-page">
      <div className="content-list-header-wrap">
        <div className="content-list-container">
          <h1 className="content-list-title">Pusat Informasi</h1>
          <div className="content-list-search-wrap">
            <Search size={20} className="content-list-search-icon" />
            <input
              type="text"
              placeholder="Cari konten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="content-list-search-input"
            />
          </div>
        </div>
      </div>

      <div className="content-list-container content-list-filter-wrap">
        <div className="content-list-filter-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`content-list-filter-btn ${selectedCategory === cat.id ? 'is-active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content-list-container content-list-body-wrap">
        {loading ? (
          <p className="content-list-state-text">Memuat konten...</p>
        ) : filteredContents.length === 0 ? (
          <div className="content-list-empty-wrap">
            <p className="content-list-empty-text">Tidak ada konten yang ditemukan</p>
          </div>
        ) : (
          <div className="content-list-grid">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                onClick={() => navigate(`/konten/${content.slug}`)}
                className="content-list-card"
              >
                <div className="content-list-thumb-wrap">
                  <img src={content.image} alt={content.title} className="content-list-thumb-img" />
                </div>

                <div className="content-list-card-content">
                  <div>
                    <div className="content-list-meta-top">
                      <span className="content-list-category-badge">
                        {categories.find((c) => c.id === content.category)?.label}
                      </span>
                      <span className="content-list-readtime">Waktu baca {content.readTime}</span>
                    </div>
                    <h3 className="content-list-card-title">{content.title}</h3>
                    <p className="content-list-card-excerpt">{content.excerpt}</p>
                  </div>
                  <div className="content-list-meta-bottom">
                    <span className="content-list-date-text">
                      {new Date(content.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <button className="content-list-read-btn" type="button">
                      Baca <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
