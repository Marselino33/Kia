import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
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
    { id: 'Parenting', label: 'Parenting' },
    { id: 'Gizi', label: 'Gizi' },
    { id: 'Kesehatan Ibu', label: 'Kesehatan Ibu' },
    { id: 'PHBS', label: 'PHBS' },
    { id: 'Mental Orang Tua', label: 'Mental Orang Tua' },
    { id: 'Umum', label: 'Informasi Umum' },
  ];

  useEffect(() => {
    setLoading(true);
    api.get('/content')
      .then((r) => {
        const rows = r.data?.data || [];
        const mapped = rows.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.judul,
          category: item.kategori || 'Umum',
          excerpt: item.ringkasan || '',
          readTime: `${item.read_minutes || 5} menit`,
          image: item.gambar_url || 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=400&h=300&fit=crop',
          date: item.created_at,
        }));
        setContents(mapped);
      })
      .catch(() => setContents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = contents;

    if (selectedCategory !== 'all') {
      result = result.filter((c) => String(c.category).toLowerCase() === String(selectedCategory).toLowerCase());
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
                        {categories.find((c) => c.id === content.category)?.label || content.category}
                      </span>
                      <span className="content-list-readtime">Waktu baca {content.readTime}</span>
                    </div>
                    <h3 className="content-list-card-title">{content.title}</h3>
                    <p className="content-list-card-excerpt">{content.excerpt}</p>
                  </div>
                  <div className="content-list-meta-bottom">
                    <span className="content-list-date-text">
                      {content.date ? new Date(content.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : '-'}
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
