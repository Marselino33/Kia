import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../../styles/pages/content-content-detail.css'

export default function ContentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data
  const sampleContent = {
    'teknik-pola-asuh-modern': {
      slug: 'teknik-pola-asuh-modern',
      title: 'Teknik Pola Asuh Modern untuk Anak Usia Dini',
      category: 'Pola Asuh',
      readTime: '8 menit',
      date: '15 Januari 2024',
      author: 'Dr. Eka Prasetya',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=800&h=400&fit=crop',
      excerpt: 'Pelajari teknik pola asuh yang efektif dan positif untuk mendukung perkembangan anak.',
      content: `
        <h2>Pendahuluan</h2>
        <p>Pola asuh merupakan aspek krusial dalam perkembangan anak. Teknik yang tepat dapat membantu anak tumbuh menjadi individu yang sehat secara emosional, sosial, dan akademis.</p>

        <h2>Prinsip Pola Asuh Modern</h2>
        <p>Pola asuh modern menggabungkan pendekatan tradisional dengan pemahaman psikologi perkembangan anak. Beberapa prinsip kunci meliputi:</p>
        <ul>
          <li><strong>Memberikan Perhatian:</strong> Menunjukkan kasih sayang dan perhatian kepada anak secara konsisten</li>
          <li><strong>Menetapkan Batasan:</strong> Menggunakan disiplin yang konsisten dan jelas</li>
          <li><strong>Mendengarkan Aktif:</strong> Memberikan waktu untuk anak berbagi perasaan dan pikiran</li>
          <li><strong>Memberi Contoh:</strong> Menunjukkan perilaku yang ingin dicontoh anak</li>
        </ul>

        <h2>Teknik Komunikasi Efektif</h2>
        <p>Komunikasi yang baik adalah fondasi hubungan orang tua-anak yang sehat. Beberapa teknik komunikasi efektif:</p>
        <ol>
          <li>Gunakan bahasa yang sederhana dan mudah dipahami</li>
          <li>Berikan pujian yang spesifik dan tepat waktu</li>
          <li>Hindari kritik yang merusak kepercayaan diri</li>
          <li>Tanyakan perasaan dan pemikiran anak</li>
        </ol>

        <h2>Mengatasi Tantangan Umum</h2>
        <p>Setiap anak memiliki tantangan unik. Sebagai orang tua, penting untuk:</p>
        <ul>
          <li>Tetap tenang dalam situasi sulit</li>
          <li>Cari solusi bersama dengan anak</li>
          <li>Belajar dari setiap kesalahan</li>
          <li>Tingkatkan kesabaran dan empati</li>
        </ul>

        <h2>Kesimpulan</h2>
        <p>Pola asuh yang baik bukan hanya tentang aturan, tetapi tentang membangun hubungan yang kuat berdasarkan cinta, kepercayaan, dan pemahaman. Dengan menerapkan teknik-teknik di atas, Anda dapat mendukung perkembangan optimal anak Anda.</p>
      `,
    },
    'stimulasi-bayi-3-bulan': {
      slug: 'stimulasi-bayi-3-bulan',
      title: 'Stimulasi yang Tepat untuk Bayi 3 Bulan',
      category: 'Stimulasi',
      readTime: '10 menit',
      date: '14 Januari 2024',
      author: 'Dr. Bambang Sutrisno',
      image: 'https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=800&h=400&fit=crop',
      excerpt: 'Panduan lengkap stimulasi motorik dan sensorik untuk bayi usia 3 bulan.',
      content: `
        <h2>Perkembangan Bayi Usia 3 Bulan</h2>
        <p>Bayi usia 3 bulan mulai menunjukkan peningkatan signifikan dalam perkembangan motorik dan kognitif. Mereka mulai dapat mengangkat kepala lebih tinggi, mengikuti gerakan dengan mata, dan mulai tersenyum secara sosial.</p>

        <h2>Stimulasi Motorik Kasar</h2>
        <p>Motorik kasar penting untuk perkembangan bayi. Beberapa kegiatan stimulasi:</p>
        <ul>
          <li><strong>Tummy Time:</strong> Letakkan bayi di perut untuk menguatkan otot leher dan bahu</li>
          <li><strong>Gerakan Kaki:</strong> Gerakkan kaki bayi dalam gerakan bersepeda</li>
          <li><strong>Angkat Kepala:</strong> Beri kesempatan bayi untuk mengangkat kepala sendiri</li>
        </ul>

        <h2>Stimulasi Sensorik</h2>
        <p>Sensorik penting untuk eksplorasi dunia. Coba:</p>
        <ul>
          <li>Perlihatkan mainan berwarna cerah yang bergerak perlahan</li>
          <li>Dengarkan suara-suara lembut bersama bayi</li>
          <li>Berikan tekstur berbeda untuk disentuh</li>
          <li>Lakukan kontak mata dan tersenyum</li>
        </ul>

        <h2>Stimulasi Kognitif</h2>
        <p>Perkembangan kognitif dimulai dari interaksi sederhana:</p>
        <ol>
          <li>Ajak bicara bayi dengan nada yang berbeda</li>
          <li>Mainkan "peek-a-boo" untuk meningkatkan kepedulian</li>
          <li>Tunjukkan mainan dan gerakkan perlahan</li>
          <li>Nyanyikan lagu-lagu sederhana berulang kali</li>
        </ol>

        <h2>Tips Penting</h2>
        <ul>
          <li>Lakukan stimulasi selama bayi dalam keadaan tenang dan terjaga</li>
          <li>Jangan memaksa jika bayi menunjukkan tanda-tanda lelah</li>
          <li>Lakukan secara konsisten tetapi tidak berlebihan</li>
          <li>Observasi respons bayi dan sesuaikan aktivitas</li>
        </ul>
      `,
    },
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundContent = sampleContent[slug];
      if (foundContent) {
        setContent(foundContent);
      } else {
        setContent(null);
      }
      setLoading(false);
    }, 500);
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
          <span>{content.date}</span>
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
