import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import '../../styles/pages/parenting-pola-asuh-anak.css';

export default function PolaAsuhAnak() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState('0-18');
  const [loading, setLoading] = useState(true);

  const ageRanges = [
    { id: 'all', label: 'Lihat Semua' },
    { id: '0-18', label: '0-18 Bulan' },
    { id: '1.5-3', label: '1.5 - 3 Tahun' },
    { id: '3-6', label: '3-6 Tahun' },
    { id: '6+', label: '6+ Tahun' },
  ];

  const stageBadges = {
    'tahap-bayi': { label: 'TAHAP BAYI', bg: '#fef3c7', text: '#92400e' },
    'tahap-salita': { label: 'TAHAP SALITA', bg: '#fce7f3', text: '#831843' },
    'tahap-pra-sekolah': { label: 'TAHAP PRA-SEKOLAH', bg: '#dbeafe', text: '#1e3a8a' },
    'tahap-sekolah': { label: 'TAHAP SEKOLAH', bg: '#dcfce7', text: '#166534' },
  };

  // Sample data
  const sampleArticles = [
    {
      id: 1,
      slug: 'membangun-kepercayaan',
      title: 'Membangun Kepercayaan',
      subtitle: 'Membangun langkah Anda dalam setiap fase perkembangan si kecil dengan pendekatan yang hangat, berdasar sains, dan penuh kasih sayang.',
      stage: 'tahap-bayi',
      ageRange: '0-18',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'left',
      content: 'Di bulan-bulan pertama, rasa percaya adalah fondasi utama. Attachment yang aman (secure attachment) terbentuk ketika orang tua merespons kebutuhan bayi dengan konsisten dan penuh kehangatan, menciptakan rasa aman bagi masa depan emosionalnya.',
    },
    {
      id: 2,
      slug: 'menghadapi-tantrum',
      title: 'Menghadapi Tantrum',
      subtitle: 'Memandu langkah Anda dalam setiap fase perkembangan si kecil dengan pendekatan yang hangat, berdasar sains, dan penuh kasih sayang.',
      stage: 'tahap-salita',
      ageRange: '1.5-3',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'right',
      content: 'Tantrum bukanlah perilaku buruk, melainkan luapan emosi yang belum bisa dievaluasi. Belajarlah teknik regulasi emosi untuk membantu si kecil mengenali dan mengelola emosinya sejak dini.',
    },
    {
      id: 3,
      slug: 'kedisiplinan-positif',
      title: 'Kedisiplinan Positif',
      subtitle: 'Pendekatan disiplin yang fokus pada solusi dan pengertian perlaku positif membimbing anak belajar tanggung jawab dan empati.',
      stage: 'tahap-pra-sekolah',
      ageRange: '3-6',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'left',
      content: 'Kedisiplinan bukan tentang hukuman, melainkan tentang menetapkan batasan yang jelas dengan cara yang menghargatkan perasaan anak. Fokus pada solusi dan pengertian perlaku positif membimbing anak belajar tanggung jawab dan empati.',
    },
    {
      id: 4,
      slug: 'kualitas-waktu-berkualitas',
      title: 'Kualitas Waktu Berkualitas',
      subtitle: 'Membangun hubungan yang kuat melalui interaksi bermakna dengan anak Anda.',
      stage: 'tahap-sekolah',
      ageRange: '6+',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'right',
      content: 'Waktu berkualitas bukan tentang durasi, melainkan tentang kehadiran penuh dan koneksi emosional. Ciptakan momen-momen bermakna yang memperkuat ikatan dan membangun kepercayaan diri anak.',
    },
    {
      id: 5,
      slug: 'menangani-perilaku-menantang',
      title: 'Menangani Perilaku Menantang',
      subtitle: 'Strategi praktis untuk menghadapi perilaku sulit dengan tenang dan bijaksana.',
      stage: 'tahap-pra-sekolah',
      ageRange: '3-6',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'left',
      content: 'Perilaku menantang adalah cara anak mengkomunikasikan kebutuhan mereka. Dengan memahami akar masalahnya, Anda dapat merespons dengan lebih efektif dan mengajarkan keterampilan sosial yang penting.',
    },
    {
      id: 6,
      slug: 'mendorong-kemandirian',
      title: 'Mendorong Kemandirian',
      subtitle: 'Membimbing anak untuk belajar melakukan hal-hal sendiri dengan percaya diri.',
      stage: 'tahap-salita',
      ageRange: '1.5-3',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=600&h=400&fit=crop',
      imagePosition: 'right',
      content: 'Kemandirian dimulai dengan memberi kesempatan. Biarkan anak mencoba, membuat kesalahan, dan belajar dari pengalamannya dengan dukungan dan dorongan dari Anda.',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setArticles(sampleArticles);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedAgeRange === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((article) => article.ageRange === selectedAgeRange));
    }
  }, [selectedAgeRange, articles]);

  const handleArticleClick = (articleId) => {
    navigate(`/pola-asuh/${articleId}`);
  };

  return (
      <main className="pola-page">
        {/* Breadcrumb */}
        <div className="pola-container pola-breadcrumb-wrap">
          <div className="pola-breadcrumb">
            <span onClick={() => navigate('/')} className="pola-breadcrumb-link">
              Beranda
            </span>
            <span className="pola-breadcrumb-sep">/</span>
            <span className="pola-breadcrumb-current-link">Parenting</span>
            <span className="pola-breadcrumb-sep">/</span>
            <span>Pola Asuh Anak</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="pola-container pola-head">
          <h1 className="pola-title">
            Pola Asuh Anak
          </h1>
          <p className="pola-subtitle">
            Memandu langkah Anda dalam setiap fase perkembangan si kecil dengan pendekatan yang hangat, berdasar sains, dan penuh kasih sayang.
          </p>
        </div>

        {/* Age Range Filter */}
        <div className="pola-container pola-filter-wrap">
          <div className="pola-filter-grid">
            {ageRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedAgeRange(range.id)}
                className={`pola-filter-btn ${selectedAgeRange === range.id ? 'active' : ''}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="pola-container pola-loading-wrap">
            <p className="pola-loading-text">Memuat artikel...</p>
          </div>
        ) : (
          <div className="pola-container pola-list-wrap">
            {filteredArticles.map((article, index) => {
              const badge = stageBadges[article.stage];
              const isImageLeft = article.imagePosition === 'left';

              return (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className={`pola-article-item ${isImageLeft ? 'image-left' : 'image-right'} ${index !== filteredArticles.length - 1 ? 'has-gap' : ''}`}
                >
                  {/* Image */}
                  <div className="pola-article-image-wrap">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="pola-article-image"
                    />
                  </div>

                  {/* Content */}
                  <div className="pola-article-content">
                    {/* Badge */}
                    <div className={`pola-stage-badge pola-stage-badge-${article.stage}`}>
                      {badge.label}
                    </div>

                    {/* Title */}
                    <h2 className="pola-article-title">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="pola-article-subtitle">
                      {article.subtitle}
                    </p>

                    {/* Content Preview */}
                    <p className="pola-article-preview">
                      {article.content}
                    </p>

                    {/* Read Button */}
                    <button className="pola-read-btn">
                      Pelajari <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
  );
}
