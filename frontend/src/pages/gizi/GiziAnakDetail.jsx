import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import '../../styles/pages/gizi-gizi-anak-detail.css';

const data = {
  '6-8': {
    title: 'Panduan Gizi Anak 6-8 Bulan',
    items: {
      pokok: {
        name: 'Karbohidrat',
        portions: '2 Porsi',
        sample: '2-3 sdm bubur nasi',
        benefit: 'Sumber energi utama untuk aktivitas dan pertumbuhan.',
        tips: ['Mulai dari tekstur halus.', 'Berikan bertahap 2-3 kali sehari.', 'Pantau respons pencernaan bayi.']
      },
      hewani: {
        name: 'Protein Hewani',
        portions: '1-2 Porsi',
        sample: '20gr ikan/ayam',
        benefit: 'Mendukung perkembangan otot, jaringan, dan imunitas.',
        tips: ['Pilih daging tanpa lemak.', 'Masak hingga matang sempurna.', 'Sajikan dalam bentuk lumat.']
      },
      nabati: {
        name: 'Protein Nabati',
        portions: '1 Porsi',
        sample: '20gr tahu/tempe halus',
        benefit: 'Pelengkap protein harian dengan serat tambahan.',
        tips: ['Kukus agar tekstur lembut.', 'Padukan dengan sayur halus.', 'Hindari bumbu tajam.']
      },
      sayur: {
        name: 'Sayur-sayuran',
        portions: '1 Porsi',
        sample: '1-2 sdm pure sayur',
        benefit: 'Sumber vitamin, mineral, dan serat penting.',
        tips: ['Gunakan variasi warna sayur.', 'Kukus sebentar agar nutrisi terjaga.', 'Kenalkan satu jenis baru per hari.']
      },
      buah: {
        name: 'Buah-buahan',
        portions: '1 Porsi',
        sample: '1-2 sdm pure buah',
        benefit: 'Mendukung kebutuhan vitamin dan antioksidan.',
        tips: ['Pilih buah matang alami.', 'Hindari tambahan gula.', 'Sajikan sesuai toleransi bayi.']
      },
      lemak: {
        name: 'Lemak Tambahan',
        portions: '1 Porsi',
        sample: '1 sdt minyak/mentega',
        benefit: 'Membantu penyerapan vitamin larut lemak.',
        tips: ['Tambahkan setelah masakan matang.', 'Gunakan lemak sehat.', 'Jangan berlebihan.']
      },
      snack: {
        name: 'Snack Sehat',
        portions: '0-1 Porsi',
        sample: 'buah lunak potong kecil',
        benefit: 'Melatih pola makan teratur dan eksplorasi tekstur.',
        tips: ['Sajikan saat bayi aktif.', 'Potong kecil agar aman.', 'Dampingi selama makan.']
      }
    }
  },
  '9-11': {
    title: 'Panduan Gizi Anak 9-11 Bulan',
    items: {
      pokok: { name: 'Karbohidrat', portions: '3 Porsi', sample: '4-5 sdm nasi tim', benefit: 'Menambah energi harian.', tips: ['Naikkan tekstur bertahap.', 'Tetap berikan cairan cukup.', 'Variasikan sumber karbohidrat.'] },
      hewani: { name: 'Protein Hewani', portions: '2 Porsi', sample: '25gr daging/ikan/telur', benefit: 'Mendukung pertumbuhan jaringan tubuh.', tips: ['Pastikan matang sempurna.', 'Cincang halus.', 'Kombinasi dengan sayur.'] },
      nabati: { name: 'Protein Nabati', portions: '1-2 Porsi', sample: '25gr tahu/tempe', benefit: 'Menyeimbangkan asupan protein.', tips: ['Sajikan lunak.', 'Hindari goreng berlebih.', 'Berikan porsi kecil dulu.'] },
      sayur: { name: 'Sayur-sayuran', portions: '2 Porsi', sample: '2-3 sdm sayur cincang', benefit: 'Membantu kesehatan pencernaan.', tips: ['Utamakan sayur segar.', 'Kukus ringan.', 'Campur dengan protein.'] },
      buah: { name: 'Buah-buahan', portions: '1-2 Porsi', sample: '3 sdm buah lembut', benefit: 'Sumber vitamin harian.', tips: ['Berikan saat snack.', 'Pilih buah rendah asam.', 'Sajikan tanpa gula tambahan.'] },
      lemak: { name: 'Lemak Tambahan', portions: '1-2 Porsi', sample: '1 sdt minyak/keju parut', benefit: 'Meningkatkan kepadatan kalori sehat.', tips: ['Tambahkan sedikit per porsi.', 'Pilih sumber lemak sehat.', 'Pantau toleransi.'] },
      snack: { name: 'Snack Sehat', portions: '1-2 Porsi', sample: 'potongan buah/ubi kukus', benefit: 'Menjaga kebutuhan energi antar makan utama.', tips: ['Sajikan finger food aman.', 'Hindari camilan kemasan manis.', 'Dampingi saat makan.'] }
    }
  },
  '1-3': {
    title: 'Panduan Gizi Anak 1-3 Tahun',
    items: {
      pokok: { name: 'Makanan Pokok', portions: '4 Porsi', sample: '1/2 mangkuk nasi', benefit: 'Sumber energi utama harian.', tips: ['Jadwal makan konsisten.', 'Variasi menu harian.', 'Porsi sesuai aktivitas anak.'] },
      hewani: { name: 'Protein Hewani', portions: '2-3 Porsi', sample: '30gr ayam/ikan/telur', benefit: 'Mendukung tumbuh kembang optimal.', tips: ['Variasi jenis protein.', 'Masak tanpa banyak garam.', 'Potong kecil agar mudah makan.'] },
      nabati: { name: 'Protein Nabati', portions: '2 Porsi', sample: '30gr tahu/tempe', benefit: 'Menambah kualitas protein harian.', tips: ['Padukan dengan protein hewani.', 'Tekstur lembut.', 'Sajikan menarik.'] },
      sayur: { name: 'Sayur-sayuran', portions: '2 Porsi', sample: '1/2 mangkuk sayur', benefit: 'Sumber serat, vitamin, dan mineral.', tips: ['Variasi warna sayur.', 'Masak tidak terlalu lama.', 'Sajikan rutin setiap hari.'] },
      buah: { name: 'Buah-buahan', portions: '2 Porsi', sample: '1/2 potong buah ukuran sedang', benefit: 'Mendukung imunitas dan metabolisme.', tips: ['Sajikan potong kecil.', 'Hindari sirup manis.', 'Berikan sebagai snack sehat.'] },
      lemak: { name: 'Minyak/Lemak', portions: '2 Porsi', sample: '1 sdt minyak/mentega', benefit: 'Membantu penyerapan nutrisi penting.', tips: ['Gunakan secukupnya.', 'Pilih lemak berkualitas.', 'Jangan digoreng berlebihan.'] },
      snack: { name: 'Snack Sehat', portions: '2 Porsi', sample: 'biskuit gandum/yogurt plain', benefit: 'Menjaga energi antar waktu makan.', tips: ['Pilih snack minim gula.', 'Batasi snack ultra-proses.', 'Berikan di jam tetap.'] }
    }
  }
};

export default function GiziAnakDetail() {
  const navigate = useNavigate();
  const { age, itemId } = useParams();

  const detail = useMemo(() => {
    const ageData = data[age] || data['6-8'];
    return ageData.items[itemId] || ageData.items.pokok;
  }, [age, itemId]);

  const ageData = data[age] || data['6-8'];

  const heroData = useMemo(() => {
    if (age === '6-8' && itemId === 'pokok') {
      return {
        title: 'Panduan Gizi Anak 0–6 Bulan',
        image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1400&q=80'
      };
    }

    if (age === '9-11') {
      return {
        title: 'Panduan Gizi Anak 9–11 Bulan',
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1400&q=80'
      };
    }

    if (age === '1-3') {
      return {
        title: 'Panduan Gizi Anak 2–5 Tahun',
        image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=1400&q=80'
      };
    }

    return {
      title: 'Panduan Gizi Anak 6–8 Bulan',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80'
    };
  }, [age, itemId]);

  const sidebarTopics = [{
    id: 1,
    tag: 'RESEP',
    title: '10 Menu MPASI Tinggi Zat Besi',
    time: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1600699899970-b8b56be7c6c6?auto=format&fit=crop&w=320&q=80'
  }, {
    id: 2,
    tag: 'KESEHATAN',
    title: 'Kapan Anak Butuh Vitamin Tambahan?',
    time: '6 menit baca',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=320&q=80'
  }, {
    id: 3,
    tag: 'TIPS',
    title: 'Alergi Susu Sapi: Gejala & Solusi',
    time: '8 menit baca',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=320&q=80'
  }, {
    id: 4,
    tag: 'TIPS',
    title: 'Alergi Susu Sapi: Gejala & Solusi',
    time: '8 menit baca',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=320&q=80'
  }, {
    id: 5,
    tag: 'TIPS',
    title: 'Alergi Susu Sapi: Gejala & Solusi',
    time: '8 menit baca',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=320&q=80'
  }, {
    id: 6,
    tag: 'TIPS',
    title: 'Alergi Susu Sapi: Gejala & Solusi',
    time: '8 menit baca',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=320&q=80'
  }];

  return (
    <main className="gizi-anak-detail-page">
      <div className="gizi-anak-detail-container">
        <div className="gizi-anak-detail-layout">
          <section className="gizi-anak-detail-main">
            <div className="gizi-anak-detail-breadcrumb">
              <span onClick={() => navigate('/beranda')} className="gizi-anak-detail-link">Beranda</span>
              <span>›</span>
              <span>Gizi</span>
              <span>›</span>
              <span onClick={() => navigate('/gizi-anak')} className="gizi-anak-detail-link">Gizi Anak</span>
              <span>›</span>
              <span className="gizi-anak-detail-current">Detail Panduan Gizi</span>
            </div>

            <h1 className="gizi-anak-detail-title">{heroData.title}</h1>

            <div className="gizi-anak-detail-hero-wrap">
              <img src={heroData.image} alt={heroData.title} className="gizi-anak-detail-hero-image" />
            </div>

            <blockquote className="gizi-anak-detail-quote">
              "Pemberian makan bukan hanya soal nutrisi yang masuk ke dalam tubuh, tetapi tentang membangun hubungan emosional yang sehat antara orang tua dan anak terhadap makanan."
            </blockquote>

            <section className="gizi-anak-detail-section">
              <h2><span className="gizi-anak-detail-icon"><Lightbulb size={15} /></span> Mengenal Hunger & Fullness Cues</h2>
              <p>Responsif feeding dimulai dengan kemampuan orang tua membaca sinyal tubuh anak. Seringkali, konflik di meja makan terjadi karena kita memaksa anak makan saat mereka sudah kenyang atau terlambat menyadari mereka lapar.</p>

              <div className="gizi-anak-detail-cues-grid">
                <article className="gizi-anak-detail-cue-card is-blue">
                  <h3>Tanda Anak Lapar:</h3>
                  <ul>
                    <li>Melihat ke arah makanan dengan antusias</li>
                    <li>Membuka mulut saat sendok mendekat</li>
                    <li>Terlihat gelisah atau rewel (sinyal akhir)</li>
                  </ul>
                </article>

                <article className="gizi-anak-detail-cue-card is-blue">
                  <h3>Tanda Anak Lapar:</h3>
                  <ul>
                    <li>Melihat ke arah makanan dengan antusias</li>
                    <li>Membuka mulut saat sendok mendekat</li>
                    <li>Terlihat gelisah atau rewel (sinyal akhir)</li>
                  </ul>
                </article>

                <article className="gizi-anak-detail-cue-card is-red">
                  <h3>Tanda Anak Kenyang:</h3>
                  <ul>
                    <li>Memalingkan wajah dari makanan</li>
                    <li>Menutup mulut rapat-rapat atau mendorong sendok</li>
                    <li>Mulai bermain-main dengan makanan</li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="gizi-anak-detail-texture-box">
              <h2>Transisi Tekstur yang Tepat</h2>
              <p>Jangan terjebak pada tekstur halus terlalu lama. Berikan tantangan pada otot oromotor anak dengan menaikkan tekstur secara bertahap (bubur saring, bubur kasar, hingga nasi tim) sesuai tahapan usianya.</p>
              <div className="gizi-anak-detail-tags">
                <span>6-9 Bulan: Bubur Saring</span>
                <span>9-12 Bulan: Nasi Tim/Cincang</span>
                <span>12+ Bulan: Menu Keluarga</span>
              </div>
            </section>
          </section>

          <aside className="gizi-anak-detail-sidebar">
            <h3>Topik Gizi Lainnya</h3>
            <div className="gizi-anak-detail-topic-list">
              {sidebarTopics.map(topic => <article key={topic.id} className="gizi-anak-detail-topic-item">
                  <img src={topic.image} alt={topic.title} className="gizi-anak-detail-topic-image" />
                  <div className="gizi-anak-detail-topic-content">
                    <span>{topic.tag}</span>
                    <h4>{topic.title}</h4>
                    <p>{topic.time}</p>
                  </div>
                </article>)}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
