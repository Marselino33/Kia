import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Clock3 } from 'lucide-react';
import '../../styles/pages/gizi-gizi-anak.css';
const giziCards = [{
  id: 1,
  title: 'Panduan Gizi Anak 0 - 6 Bulan',
  subtitle: 'Uji pemahaman Anda tentang milestone perkembangan bayi, jadwal imunisasi, dan teknik stimulasi dini yang tepat.',
  duration: '5 Menit',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  badge: '',
  route: '/gizi-anak/6-8/pokok'
}, {
  id: 2,
  title: 'Panduan Gizi Anak 6 - 8 Bulan',
  subtitle: 'Seberapa paham Ibu tentang kandungan nutrisi makro dan mikro untuk mencegah stunting pada masa MPASI?',
  duration: '8 Menit',
  image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
  badge: 'PENTING',
  route: '/gizi-anak/6-8/hewani'
}, {
  id: 3,
  title: 'Panduan Gizi Anak 9 - 11 Bulan',
  subtitle: 'Kenali tanda-tanda baby blues, burnout pada orang tua, dan cara menjaga kesehatan emosional selama mendampingi si Kecil.',
  duration: '6 Menit',
  image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  badge: 'PSIKOLOGI',
  route: '/gizi-anak/9-11/pokok'
}, {
  id: 4,
  title: 'Panduan Gizi Anak 12 - 23 Bulan',
  subtitle: 'Kenali tanda-tanda baby blues, burnout pada orang tua, dan cara menjaga kesehatan emosional selama mendampingi si Kecil.',
  duration: '6 Menit',
  image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  badge: 'PSIKOLOGI',
  route: '/gizi-anak/1-3/pokok'
}, {
  id: 5,
  title: 'Panduan Gizi Anak 2 - 5 Tahun',
  subtitle: 'Kenali tanda-tanda baby blues, burnout pada orang tua, dan cara menjaga kesehatan emosional selama mendampingi si Kecil.',
  duration: '6 Menit',
  image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  badge: 'PSIKOLOGI',
  route: '/gizi-anak/1-3/hewani'
}];

export default function GiziAnak() {
  const navigate = useNavigate();

  return <section className="gizi-anak-page">
      <div className="gizi-anak-container">
        <div className="gizi-anak-breadcrumb">
          <span onClick={() => navigate('/beranda')} className="gizi-anak-breadcrumb-link">Beranda</span>
          <span className="gizi-anak-breadcrumb-sep">›</span>
          <span className="gizi-anak-breadcrumb-parent">Gizi</span>
          <span className="gizi-anak-breadcrumb-sep">›</span>
          <span className="gizi-anak-breadcrumb-current">Gizi Anak</span>
        </div>

        <div className="gizi-anak-head">
          <h1 className="gizi-anak-title">Panduan Gizi Anak</h1>
          <p className="gizi-anak-subtitle">Pilih kuis untuk menguji wawasan Anda tentang pola asuh dan kesehatan si Kecil.</p>
          <p className="gizi-anak-subtitle">Dapatkan hasil instan dan saran dari para ahli KIA.</p>
        </div>

        <div className="gizi-anak-grid">
          {giziCards.map(item => {
          return <article key={item.id} className="gizi-anak-card" onClick={() => navigate(item.route)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate(item.route)}>
                <div className="gizi-anak-card-image-wrap">
                  <img src={item.image} alt={item.title} className="gizi-anak-card-image" />
                </div>

                <div className="gizi-anak-card-content">
                  <div className="gizi-anak-card-meta">
                    {item.badge && <span className="gizi-anak-card-badge">{item.badge}</span>}
                    <span className="gizi-anak-card-time"><Clock3 size={12} /> {item.duration}</span>
                  </div>
                  <h3 className="gizi-anak-card-heading">{item.title}</h3>
                  <p className="gizi-anak-card-content-text">{item.subtitle}</p>
                  <button className="gizi-anak-read-btn" type="button">Lihat Panduan <ChevronRight size={14} /></button>
                </div>
              </article>;
        })}
        </div>

        <div className="gizi-anak-load-wrap">
          <button type="button" className="gizi-anak-load-btn">Muat Lebih Banyak <ChevronDown size={16} /></button>
        </div>
      </div>

    </section>;
}

