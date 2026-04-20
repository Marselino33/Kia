import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../lib/api';
import '../../styles/pages/content-content-detail.css'

export default function ContentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/content/${slug}`)
      .then((r) => {
        const item = r.data?.data;
        if (!item) {
          setContent(null);
          return;
        }
        setContent({
          slug: item.slug,
          title: item.judul,
          category: item.kategori || '-',
          readTime: `${item.read_minutes || 5} menit`,
          date: item.created_at,
          author: 'Portal KIA',
          image: item.gambar_url || 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=800&h=400&fit=crop',
          content: item.isi || '<p>Konten belum tersedia.</p>',
        });
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="content-detail-status-page">
        <p className="content-detail-status-text">Memuat konten...</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="content-detail-status-page">
        <p className="content-detail-status-text content-detail-status-not-found">Konten tidak ditemukan</p>
        <button
          onClick={() => navigate('/konten')}
          className="content-detail-primary-btn"
        >
          Kembali ke Pusat Informasi
        </button>
      </main>
    );
  }

  return (
    <main className="content-detail-page">
      <div className="content-detail-hero-wrap">
        <img
          src={content.image}
          alt={content.title}
          className="content-detail-hero-img"
        />
      </div>

      <div className="content-detail-container">
        <button
          onClick={() => navigate('/konten')}
          className="content-detail-back-btn"
          type="button"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>

        <h1 className="content-detail-title">{content.title}</h1>
        <div className="content-detail-meta-row">
          <span>{content.author}</span>
          <span>&bull;</span>
          <span>{content.date ? new Date(content.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) : '-'}</span>
          <span>&bull;</span>
          <span>Waktu baca {content.readTime}</span>
        </div>

        <div
          className="content-detail-body"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        <div className="content-detail-footer-action">
          <button
            onClick={() => navigate('/konten')}
            className="content-detail-primary-btn"
            type="button"
          >
            Lihat Konten Lainnya
          </button>
        </div>
      </div>
    </main>
  );
}
