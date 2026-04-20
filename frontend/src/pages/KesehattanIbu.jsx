import { useState } from 'react';
import AdminBar from '../components/AdminBar';
import { Link } from 'react-router-dom';
import { Heart, Users, Phone, Mail } from 'lucide-react';
import '../styles/pages/kesehattan-ibu.css';
const RECOVERY_GUIDES = [{
  id: 1,
  icon: 'ðŸ˜¢',
  title: 'Mengelola Baby Blues',
  description: 'Memahami gejala dan cara mengatasi perasaan sedih setelah melahirkan. Langkah-langkah praktis untuk pemulihan emosional Anda.',
  link: '/kesehatan-ibu/baby-blues'
}, {
  id: 2,
  icon: 'â°',
  title: 'Pentingnya Me-Time',
  description: 'Mengalokasikan waktu untuk diri sendiri sangat penting bagi kesehatan mental. Tips sederhana untuk self-care rutin.',
  link: '/kesehatan-ibu/me-time'
}, {
  id: 3,
  icon: 'ðŸ‘¥',
  title: 'Membangun Support System',
  description: 'Cara membangun sistem dukungan keluarga dan komunitas untuk menjalani motherhood dengan lebih tenang dan bahagia.',
  link: '/kesehatan-ibu/support-system'
}];
const DAILY_TIPS = [{
  icon: 'â¤ï¸',
  title: 'Self-Love',
  description: 'Luangkan waktu untuk mencintai dan menghargai diri sendiri setiap hari.'
}, {
  icon: 'ðŸ§˜',
  title: 'Mindfulness',
  description: 'Praktik meditasi sederhana untuk menenangkan pikiran dan mengurangi stres.'
}, {
  icon: 'ðŸŽ¯',
  title: 'Parentalitas',
  description: 'Strategi praktis untuk menjadi ibu yang lebih tenang dan sabar.'
}, {
  icon: 'â˜€ï¸',
  title: 'Self-Care',
  description: 'Rutinitas perawatan diri yang sederhana namun efektif untuk kesejahteraan Anda.'
}];
const REFLECTION_QUIZ = [{
  question: 'Seberapa sering Anda merasa merasa tenang menghadapi tantangan parenting anak Anda?',
  options: ['Selalu', 'Sering', 'Kadang-kadang', 'Jarang']
}];
export default function KesehattanIbu() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  return <div className="isx-kesehattanibu-1">
            <AdminBar label="Tambah Konten Parenting" onClick={() => {}} />
            {/* Hero Section */}
            <div className="isx-kesehattanibu-2">
                <div className="isx-kesehattanibu-3">
                    <div>
                        <div className="isx-kesehattanibu-4">
                            ðŸ§˜ SELF-CARE PRIORITY
                        </div>
                        <h1 className="isx-kesehattanibu-5">
                            Kesehatan Mental<br /><span className="isx-kesehattanibu-6">Orang Tua</span>
                        </h1>
                        <p className="isx-kesehattanibu-7">
                            Menjaga kesehatan emosional Anda adalah kunci untuk memberikan buah hati dengan penuh kehangatan, cinta dan kasih sayang. Luangkan waktu untuk merawat diri sendiri.
                        </p>
                        <div className="isx-kesehattanibu-8">
                            <button className="isx-kesehattanibu-9">
                                Mulai Belajar Self-Care â†’
                            </button>
                            <button className="isx-kesehattanibu-10">
                                Eksplorasi Topik
                            </button>
                        </div>
                    </div>
                    <div className="isx-kesehattanibu-11">
                        <div className="isx-kesehattanibu-12">ðŸ§˜â€â™€ï¸</div>
                    </div>
                </div>
            </div>

            {/* Recovery Guides Section */}
            <div className="isx-kesehattanibu-13">
                <h2 className="isx-kesehattanibu-14">
                    Panduan Pemulihan Emosional Ibu
                </h2>
                <p className="isx-kesehattanibu-15">
                    Langkah-langkah praktis untuk mengelola kesehatan mental pascamelahirkan dan membangun resiliensi.
                </p>

                <div className="isx-kesehattanibu-16">
                    {RECOVERY_GUIDES.map(guide => <Link key={guide.id} to={guide.link} className="isx-kesehattanibu-17">
                            <div onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }} onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = 'none';
          }} className="isx-kesehattanibu-18">
                                <div className="isx-kesehattanibu-19">{guide.icon}</div>
                                <h3 className="isx-kesehattanibu-20">
                                    {guide.title}
                                </h3>
                                <p className="isx-kesehattanibu-21">
                                    {guide.description}
                                </p>
                            </div>
                        </Link>)}
                </div>
            </div>

            {/* Quiz Section */}
            <div className="isx-kesehattanibu-22">
                <div className="isx-kesehattanibu-23">
                    <div className="isx-kesehattanibu-24">
                        ðŸ§  SELF-REFLECTION
                    </div>
                    <h2 stnyle={{
          fontSize: '1.8rem',
          fontWeight: 900,
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
                        Self Check: Refleksi Kesehatan Mental Orang Tua
                    </h2>
                    <p className="isx-kesehattanibu-25">
                        Pahami lebih dalam kondisi emosional Anda dan bagaimana interaksi dengan si kecil. Refleksi kuis adalah langkah awal pengasuhan yang lebih tenang.
                    </p>

                    <div className="isx-kesehattanibu-26">
                        <h3 className="isx-kesehattanibu-27">
                            {REFLECTION_QUIZ[0].question}
                        </h3>
                        <div className="isx-kesehattanibu-28">
                            {REFLECTION_QUIZ[0].options.map((option, idx) => <label key={idx} className={selectedAnswer === idx ? "isx-kesehattanibu-29 isx-kesehattanibu-29--on" : "isx-kesehattanibu-29 isx-kesehattanibu-29--off"}>
                                    <input type="radio" name="answer" checked={selectedAnswer === idx} onChange={() => setSelectedAnswer(idx)} className="isx-kesehattanibu-30" />
                                    <span className="isx-kesehattanibu-31">{option}</span>
                                </label>)}
                        </div>
                        <button onMouseEnter={e => e.currentTarget.style.background = '#1565C0'} onMouseLeave={e => e.currentTarget.style.background = '#42a5f5'} className="isx-kesehattanibu-32">
                            Mulai â†’
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Tips Section */}
            <div className="isx-kesehattanibu-33">
                <h2 className="isx-kesehattanibu-34">
                    Tips Harian untuk Ibu Bahagia
                </h2>
                <p className="isx-kesehattanibu-35">
                    Kebahagiaan Anda adalah hadiah terbaik untuk keluarga.
                </p>

                <div className="isx-kesehattanibu-36">
                    {DAILY_TIPS.map((tip, idx) => <div key={idx} onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
        }} onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '';
        }} className="isx-kesehattanibu-37">
                            <div className="isx-kesehattanibu-38">{tip.icon}</div>
                            <h3 className="isx-kesehattanibu-39">
                                {tip.title}
                            </h3>
                            <p className="isx-kesehattanibu-40">
                                {tip.description}
                            </p>
                        </div>)}
                </div>
            </div>

            {/* Support Section */}
            <div className="isx-kesehattanibu-41">
                <div className="isx-kesehattanibu-42">
                    <h2 className="isx-kesehattanibu-43">
                        Butuh teman bicara?
                    </h2>
                    <p className="isx-kesehattanibu-44">
                        Konselor dan psikolog kami siap membantu Anda. Layanan konsultasi KIA Pintar tersedia 24/7 melalui chat rahasia dan aman.
                    </p>
                    <div className="isx-kesehattanibu-45">
                        <button className="isx-kesehattanibu-46">
                            <Mail size={18} /> Tanya Pakar Sekuritas
                        </button>
                        <button className="isx-kesehattanibu-47">
                            <Phone size={18} /> Telekonsulatsi Video
                        </button>
                    </div>
                </div>
            </div>
        </div>;
}