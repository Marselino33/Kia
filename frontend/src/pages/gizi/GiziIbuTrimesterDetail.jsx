import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import '../../styles/pages/gizi-gizi-ibu-trimester-detail.css';

const data = {
  trimester1: {
    title: 'Panduan Gizi Ibu Hamil Trimester 1',
    items: {
      'makanan-pokok': { name: 'Makanan Pokok', portions: '6 Porsi', sample: '100gr nasi', benefit: 'Memenuhi kebutuhan energi dasar harian ibu.', tips: ['Pilih karbohidrat kompleks.', 'Bagi porsi kecil tapi sering.', 'Hindari jeda makan terlalu lama.'] },
      'protein-hewani': { name: 'Protein Hewani', portions: '4 Porsi', sample: '50gr ikan/daging', benefit: 'Mendukung pembentukan jaringan janin.', tips: ['Pilih sumber rendah lemak jenuh.', 'Masak matang sempurna.', 'Variasikan jenis protein.'] },
      'protein-nabati': { name: 'Protein Nabati', portions: '4 Porsi', sample: '50gr tempe/tahu', benefit: 'Menambah asupan protein dan serat.', tips: ['Kombinasikan dengan sayur.', 'Pilih olahan minim minyak.', 'Berikan variasi menu.'] },
      sayur: { name: 'Sayur-sayuran', portions: '4 Porsi', sample: '100gr sayuran masak', benefit: 'Sumber folat, serat, dan mikronutrien.', tips: ['Pilih sayur hijau beragam.', 'Cuci bersih sebelum dimasak.', 'Masak tidak terlalu lama.'] },
      buah: { name: 'Buah-buahan', portions: '4 Porsi', sample: '100gr pepaya/pisang', benefit: 'Mendukung imunitas dan pencernaan.', tips: ['Utamakan buah segar.', 'Batasi jus dengan gula tambahan.', 'Konsumsi sesuai jadwal snack.'] },
      lemak: { name: 'Minyak/Lemak', portions: '5 Porsi', sample: '5gr (1 sdt) minyak', benefit: 'Membantu penyerapan vitamin penting.', tips: ['Gunakan lemak sehat.', 'Batasi gorengan.', 'Tambah secukupnya dalam menu.'] },
      gula: { name: 'Gula', portions: '2 Porsi', sample: '10gr (1 sdm) gula', benefit: 'Sumber energi cepat bila dibutuhkan.', tips: ['Batasi konsumsi harian.', 'Hindari minuman terlalu manis.', 'Prioritaskan karbohidrat kompleks.'] }
    }
  },
  trimester2: {
    title: 'Panduan Gizi Ibu Hamil Trimester 2',
    items: {
      'makanan-pokok': { name: 'Makanan Pokok', portions: '6-7 Porsi', sample: '100gr nasi', benefit: 'Menopang peningkatan kebutuhan energi trimester 2.', tips: ['Tingkatkan porsi bertahap.', 'Pilih sumber karbohidrat utuh.', 'Atur jadwal makan teratur.'] },
      'protein-hewani': { name: 'Protein Hewani', portions: '4-5 Porsi', sample: '50gr ayam/ikan', benefit: 'Mendukung pertumbuhan organ janin.', tips: ['Utamakan ikan rendah merkuri.', 'Masak matang.', 'Variasikan protein setiap hari.'] },
      'protein-nabati': { name: 'Protein Nabati', portions: '4 Porsi', sample: '50gr tahu/tempe', benefit: 'Menyeimbangkan asupan protein harian.', tips: ['Padukan dengan hewani.', 'Pilih olah kukus/panggang.', 'Kurangi garam berlebih.'] },
      sayur: { name: 'Sayur-sayuran', portions: '4-5 Porsi', sample: '100gr sayuran masak', benefit: 'Membantu pencernaan dan kebutuhan mikronutrien.', tips: ['Variasi warna sayur.', 'Konsumsi harian.', 'Cukup air putih.'] },
      buah: { name: 'Buah-buahan', portions: '4 Porsi', sample: '100gr buah segar', benefit: 'Mendukung vitamin dan antioksidan ibu.', tips: ['Buah segar lebih baik.', 'Hindari pemanis tambahan.', 'Konsumsi di sela makan.'] },
      lemak: { name: 'Minyak/Lemak', portions: '5 Porsi', sample: '5gr (1 sdt) minyak', benefit: 'Sumber asam lemak esensial.', tips: ['Pilih lemak tak jenuh.', 'Batasi makanan cepat saji.', 'Gunakan secukupnya.'] },
      gula: { name: 'Gula', portions: '2 Porsi', sample: '10gr (1 sdm) gula', benefit: 'Sumber energi cepat.', tips: ['Kontrol asupan manis.', 'Perhatikan kadar gula darah.', 'Utamakan makanan utuh.'] }
    }
  },
  menyusui: {
    title: 'Panduan Gizi Ibu Menyusui',
    items: {
      'makanan-pokok': { name: 'Makanan Pokok', portions: '7 Porsi', sample: '100gr nasi', benefit: 'Membantu kebutuhan energi produksi ASI.', tips: ['Makan teratur 3x + snack sehat.', 'Pilih karbohidrat kompleks.', 'Cukupi asupan cairan.'] },
      'protein-hewani': { name: 'Protein Hewani', portions: '5 Porsi', sample: '50gr ikan/telur/daging', benefit: 'Mendukung kualitas nutrisi ASI.', tips: ['Variasikan sumber protein.', 'Utamakan cara masak sehat.', 'Konsumsi setiap hari.'] },
      'protein-nabati': { name: 'Protein Nabati', portions: '4 Porsi', sample: '50gr tahu/tempe', benefit: 'Pelengkap protein dan serat ibu.', tips: ['Padukan menu seimbang.', 'Hindari minyak berlebih.', 'Sajikan segar.'] },
      sayur: { name: 'Sayur-sayuran', portions: '5 Porsi', sample: '100gr sayuran masak', benefit: 'Mendukung vitamin dan pemulihan pascamelahirkan.', tips: ['Pilih sayur beragam.', 'Konsumsi tiap makan.', 'Jaga hidrasi.'] },
      buah: { name: 'Buah-buahan', portions: '4 Porsi', sample: '100gr buah segar', benefit: 'Menambah vitamin dan antioksidan harian.', tips: ['Buah segar tanpa gula.', 'Jadikan snack sehat.', 'Variasikan jenis buah.'] },
      lemak: { name: 'Minyak/Lemak', portions: '5 Porsi', sample: '5gr (1 sdt) minyak', benefit: 'Mendukung kebutuhan energi tambahan.', tips: ['Gunakan lemak sehat.', 'Batasi lemak trans.', 'Tambah secukupnya pada masakan.'] },
      gula: { name: 'Gula', portions: '2 Porsi', sample: '10gr (1 sdm) gula', benefit: 'Sumber energi cepat bila diperlukan.', tips: ['Batasi minuman manis.', 'Pantau asupan gula total.', 'Utamakan karbohidrat kompleks.'] }
    }
  }
};

export default function GiziIbuTrimesterDetail() {
  const navigate = useNavigate();
  const { stage, itemId } = useParams();

  const stageData = data[stage] || data.trimester1;
  const detail = useMemo(() => stageData.items[itemId] || stageData.items['makanan-pokok'], [stageData, itemId]);

  return (
    <main className="gizi-ibu-detail-page">
      <div className="gizi-ibu-detail-container">
        <div className="gizi-ibu-detail-breadcrumb">
          <span onClick={() => navigate('/beranda')} className="gizi-ibu-detail-link">Beranda</span>
          <span>›</span>
          <span>Gizi</span>
          <span>›</span>
          <span onClick={() => navigate('/gizi-ibu-trimester1')} className="gizi-ibu-detail-link">Gizi Ibu</span>
          <span>›</span>
          <span className="gizi-ibu-detail-current">Detail Panduan</span>
        </div>

        <button type="button" className="gizi-ibu-detail-back" onClick={() => navigate('/gizi-ibu-trimester1')}>
          <ArrowLeft size={16} /> Kembali ke Gizi Ibu
        </button>

        <div className="gizi-ibu-detail-card">
          <h1>{detail.name}</h1>
          <p className="gizi-ibu-detail-parent">{stageData.title}</p>

          <div className="gizi-ibu-detail-meta">
            <div>
              <span>Jumlah Porsi</span>
              <strong>{detail.portions}</strong>
            </div>
            <div>
              <span>Contoh 1 Porsi</span>
              <strong>{detail.sample}</strong>
            </div>
          </div>

          <section>
            <h2>Manfaat Utama</h2>
            <p>{detail.benefit}</p>
          </section>

          <section>
            <h2>Tips Konsumsi</h2>
            <ul>
              {detail.tips.map((tip) => (
                <li key={tip}><CheckCircle2 size={16} /> <span>{tip}</span></li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
