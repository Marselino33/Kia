import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, CircleX, Medal, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { contentService } from '../../api/contentService';
import '../../styles/pages/parenting-quiz-play.css';

const QUIZ_TOPICS = {
  'pola-asuh-dasar': {
    title: 'Kuis Pola Asuh Dasar',
    description: 'Pemahaman dasar pengasuhan usia 0-24 bulan.',
    accent: 'var(--primary-500)',
    questions: [
      {
        text: 'Stimulasi terbaik untuk bayi 0-6 bulan adalah...',
        options: ['Bermain gawai sendiri', 'Interaksi tatap muka, suara lembut, dan sentuhan', 'Latihan membaca buku teks', 'Membiarkan bayi diam tanpa respons'],
        answer: 1,
        explanation: 'Bayi membutuhkan respons sosial hangat agar perkembangan emosi dan kognitif terbentuk dengan baik.',
      },
      {
        text: 'Saat anak tantrum, langkah pertama orang tua sebaiknya...',
        options: ['Membentak agar segera diam', 'Membiarkan tanpa pendampingan', 'Menenangkan diri lalu validasi emosi anak', 'Menghukum dengan ancaman'],
        answer: 2,
        explanation: 'Validasi emosi membuat anak merasa aman, sehingga lebih mudah diarahkan setelah tenang.',
      },
      {
        text: 'Kebiasaan tidur yang sehat untuk balita adalah...',
        options: ['Jam tidur berubah tiap hari', 'Rutinitas malam yang konsisten', 'Minum teh manis sebelum tidur', 'Menonton video sampai tertidur'],
        answer: 1,
        explanation: 'Rutinitas konsisten membantu ritme sirkadian dan kualitas tidur anak.',
      },
    ],
  },
  'gizi-dan-mpasi': {
    title: 'Kuis Gizi dan MPASI',
    description: 'Cek pengetahuan nutrisi anak dan menu MPASI seimbang.',
    accent: '#0f766e',
    questions: [
      {
        text: 'Prinsip utama MPASI pada awal pemberian adalah...',
        options: ['Asin dan pedas agar anak cepat suka', 'Tekstur disesuaikan usia dan diberikan bertahap', 'Langsung makanan keluarga penuh', 'Hanya buah saja setiap hari'],
        answer: 1,
        explanation: 'MPASI diberikan bertahap sesuai kesiapan oral-motor anak dan kebutuhan gizinya.',
      },
      {
        text: 'Sumber zat besi yang baik untuk MPASI adalah...',
        options: ['Kaldu bening saja', 'Biskuit manis', 'Hati ayam/daging dan kacang-kacangan', 'Air putih lebih banyak'],
        answer: 2,
        explanation: 'Zat besi penting untuk mencegah anemia dan mendukung perkembangan otak.',
      },
      {
        text: 'Jadwal MPASI yang tepat pada awal 6 bulan umumnya...',
        options: ['1-2 kali makanan utama + ASI tetap', '5 kali makanan berat', 'Tanpa ASI', 'Hanya snack kemasan'],
        answer: 0,
        explanation: 'Pada fase awal, frekuensi makan dimulai ringan sambil ASI tetap menjadi sumber utama.',
      },
    ],
  },
  'kesehatan-mental-orangtua': {
    title: 'Kuis Kesehatan Mental Orang Tua',
    description: 'Mengenali stres pengasuhan dan strategi regulasi emosi.',
    accent: '#0ea5e9',
    questions: [
      {
        text: 'Tanda umum burnout orang tua adalah...',
        options: ['Lebih fokus dan segar', 'Mudah marah, lelah berkepanjangan, dan menarik diri', 'Selalu bersemangat', 'Tidur lebih teratur'],
        answer: 1,
        explanation: 'Burnout ditandai kelelahan emosional, jarak psikologis, dan penurunan kapasitas adaptasi.',
      },
      {
        text: 'Langkah cepat saat merasa kewalahan adalah...',
        options: ['Menyalahkan diri sendiri', 'Ambil jeda napas 4-6, minta bantuan pasangan/keluarga', 'Memendam terus', 'Menambah beban aktivitas'],
        answer: 1,
        explanation: 'Teknik napas dan dukungan sosial menurunkan aktivasi stres akut.',
      },
      {
        text: 'Kapan perlu mencari bantuan profesional?',
        options: ['Jika gejala mengganggu fungsi harian berhari-hari', 'Hanya jika ada waktu luang', 'Saat semua sudah parah sekali', 'Tidak perlu sama sekali'],
        answer: 0,
        explanation: 'Jika fungsi harian terganggu konsisten, konsultasi profesional lebih aman dan efektif.',
      },
    ],
  },
};

const FEATURE_FETCHERS = {
  parenting: contentService.getParentingBySlug,
  'pola-asuh': contentService.getPolaAsuhBySlug,
  'gizi-ibu': contentService.getGiziIbuBySlug,
  'gizi-anak': contentService.getGiziAnakBySlug,
  mpasi: contentService.getMpasiBySlug,
  'resep-mpasi': contentService.getMpasiBySlug,
  'informasi-umum': contentService.getInformasiUmumBySlug,
  'mental-orang-tua': contentService.getMentalOrangTuaBySlug,
};

const FEATURE_LABELS = {
  parenting: 'Stimulus Anak',
  'pola-asuh': 'Pola Asuh',
  'gizi-ibu': 'Gizi Ibu',
  'gizi-anak': 'Gizi Anak',
  mpasi: 'MPASI',
  'resep-mpasi': 'Resep MPASI',
  'informasi-umum': 'Informasi Umum',
  'mental-orang-tua': 'Mental Orang Tua',
};

function detailPathForContent(feature, contentSlug) {
  if (!feature || !contentSlug) return '/kuis-parenting';

  const map = {
    parenting: `/stimulus/${contentSlug}`,
    'pola-asuh': `/pola-asuh/${contentSlug}`,
    'gizi-ibu': `/gizi/ibu/${contentSlug}`,
    'gizi-anak': `/gizi/anak/${contentSlug}`,
    mpasi: `/resep-mpasi/${contentSlug}`,
    'resep-mpasi': `/resep-mpasi/${contentSlug}`,
    'informasi-umum': `/informasi-umum/${contentSlug}`,
    'mental-orang-tua': `/mental-orang-tua/${contentSlug}`,
  };

  return map[feature] || '/kuis-parenting';
}

function normalizeLine(line) {
  return (line || '')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function toPlainList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLine(String(item))).filter(Boolean);
  }

  if (typeof value === 'string') {
    if (value.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.map((item) => normalizeLine(String(item))).filter(Boolean)
          : [];
      } catch {
        // no-op: handled by line split below
      }
    }

    return value
      .split(/\r?\n/)
      .map((line) => normalizeLine(line))
      .filter(Boolean);
  }

  return [];
}

function shorten(text, length = 90) {
  const source = (text || '').replace(/\s+/g, ' ').trim();
  if (!source) return '';
  if (source.length <= length) return source;
  return `${source.slice(0, length).trimEnd()}...`;
}

function buildContentQuiz(feature, contentSlug, content) {
  const title = content?.judul || 'Materi Parenting';
  const ringkasan = content?.ringkasan || content?.isi || 'Pelajari materi berikut lalu jawab kuis pemahaman.';
  const phase = content?.phase || 'Semua usia';
  const langkah = toPlainList(content?.langkah_praktis);
  const isiLines = toPlainList(content?.isi);
  const firstPracticalStep = langkah[0] || isiLines[0] || 'Pahami materi dengan pendampingan orang tua secara konsisten.';

  return {
    title: `Kuis Materi: ${title}`,
    description: `Uji pemahamanmu untuk materi ${FEATURE_LABELS[feature] || 'konten'} ini sebelum lanjut ke materi berikutnya.`,
    accent: '#0284c7',
    questions: [
      {
        text: 'Apa topik utama dari materi ini?',
        options: [
          title,
          'Administrasi sekolah dasar',
          'Pengelolaan keuangan keluarga',
          'Rekap belanja bulanan',
        ],
        answer: 0,
        explanation: `Topik utama materi ini adalah "${title}".`,
      },
      {
        text: 'Materi ini paling relevan untuk rentang usia/fase apa?',
        options: [
          phase,
          'Khusus usia lanjut',
          'Tanpa melihat fase usia',
          'Hanya untuk remaja akhir',
        ],
        answer: 0,
        explanation: `Rentang usia/fase yang dituju pada materi ini adalah "${phase}".`,
      },
      {
        text: 'Langkah praktis awal yang dianjurkan adalah...',
        options: [
          shorten(firstPracticalStep, 100),
          'Menerapkan kebiasaan secara acak tanpa jadwal',
          'Menunggu sampai anak rewel dulu',
          'Mengabaikan tahapan usia anak',
        ],
        answer: 0,
        explanation: `Langkah awal yang dianjurkan adalah: ${shorten(firstPracticalStep, 120)}`,
      },
      {
        text: 'Tujuan utama materi ini adalah...',
        options: [
          shorten(ringkasan, 95),
          'Mengganti peran orang tua sepenuhnya',
          'Membatasi komunikasi dengan anak',
          'Menyamakan pendekatan untuk semua kondisi',
        ],
        answer: 0,
        explanation: `Fokus materi ini adalah: ${shorten(ringkasan, 140)}`,
      },
    ],
    meta: {
      feature,
      contentSlug,
      contentTitle: title,
    },
  };
}

export default function ParentingQuizPlay() {
  const { topicId, feature, contentSlug } = useParams();
  const navigate = useNavigate();
  const isContentQuiz = Boolean(feature && contentSlug);

  const [dynamicTopic, setDynamicTopic] = useState(null);
  const [dynamicTopicLoading, setDynamicTopicLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const topic = useMemo(() => {
    if (isContentQuiz) return dynamicTopic;
    return QUIZ_TOPICS[topicId];
  }, [isContentQuiz, dynamicTopic, topicId]);

  const quizId = useMemo(() => {
    if (isContentQuiz) return `content:${feature}:${contentSlug}`;
    return topicId;
  }, [isContentQuiz, feature, contentSlug, topicId]);

  const question = topic?.questions[currentIndex];
  const progress = useMemo(() => {
    if (!topic) return 0;
    return Math.round(((currentIndex + (submitted ? 1 : 0)) / topic.questions.length) * 100);
  }, [currentIndex, submitted, topic]);

  useEffect(() => {
    if (!isContentQuiz) return;

    const fetcher = FEATURE_FETCHERS[feature];
    if (!fetcher || !contentSlug) {
      setDynamicTopic(null);
      return;
    }

    const loadContentQuiz = async () => {
      setDynamicTopicLoading(true);
      try {
        const content = await fetcher(contentSlug);
        if (!content) {
          setDynamicTopic(null);
          return;
        }
        setDynamicTopic(buildContentQuiz(feature, contentSlug, content));
      } catch {
        setDynamicTopic(null);
      } finally {
        setDynamicTopicLoading(false);
      }
    };

    loadContentQuiz();
  }, [isContentQuiz, feature, contentSlug]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setSelectedAnswers([]);
  }, [quizId]);

  const loadHistory = async () => {
    if (!quizId) return;
    setHistoryLoading(true);
    try {
      const resp = await api.get('/quizzes/history', {
        params: {
          quiz_id: quizId,
          limit: 5,
        },
      });
      setHistory(resp.data?.data || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [quizId]);

  if (dynamicTopicLoading) {
    return (
      <section className="parenting-quiz-play-page">
        <div className="container parenting-quiz-play-shell">
          <div className="glass-card parenting-quiz-notfound">
            <h1>Menyiapkan kuis materi...</h1>
            <p>Harap tunggu sebentar.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!topic) {
    return (
      <section className="parenting-quiz-play-page">
        <div className="container parenting-quiz-play-shell">
          <div className="glass-card parenting-quiz-notfound">
            <h1>Topik kuis tidak ditemukan</h1>
            <p>Pilih kembali kuis dari halaman Kuis Pemahaman.</p>
            <Link className="parenting-quiz-link" to="/kuis-parenting">Kembali ke daftar kuis</Link>
          </div>
        </div>
      </section>
    );
  }

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const saveAttempt = async (finalScore) => {
    try {
      await api.post('/quizzes/attempt', {
        quiz_id: quizId,
        score: finalScore,
        total: 100,
        title: topic.title,
        category: isContentQuiz ? `Materi ${FEATURE_LABELS[feature] || 'Konten'}` : 'Parenting',
      });
      await loadHistory();
    } catch (err) {
      const message = err?.response?.data?.message || 'Skor belum bisa disimpan, coba lagi.';
      toast.error(message);
    }
  };

  const handleNext = () => {
    if (selected === null) return;

    const isCorrect = selected === question.answer;
    const nextScore = isCorrect ? score + 1 : score;
    const nextSelectedAnswers = [...selectedAnswers, selected];
    setSelectedAnswers(nextSelectedAnswers);

    if (currentIndex >= topic.questions.length - 1) {
      const finalPercentage = Math.round((nextScore / topic.questions.length) * 100);
      setScore(nextScore);
      setSubmitted(true);
      saveAttempt(finalPercentage);
      return;
    }

    setScore(nextScore);
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setSelectedAnswers([]);
  };

  if (submitted) {
    const percentage = Math.round((score / topic.questions.length) * 100);
    return (
      <section className="parenting-quiz-play-page">
        <div className="container parenting-quiz-play-shell">
          <div className="glass-card parenting-quiz-result">
            <div className="parenting-quiz-result-icon" style={{ backgroundColor: `${topic.accent}1A` }}>
              <Medal color={topic.accent} size={34} />
            </div>
            <h1>{topic.title}</h1>
            <p>Skor akhir kamu:</p>
            <div className="parenting-quiz-score" style={{ color: topic.accent }}>{percentage}</div>
            <p className="parenting-quiz-score-detail">
              Jawaban benar {score} dari {topic.questions.length} pertanyaan.
            </p>
            <div className="parenting-quiz-result-actions">
              <button onClick={handleRestart} className="parenting-quiz-btn parenting-quiz-btn-soft">
                <RefreshCw size={16} /> Ulangi Kuis
              </button>
              {isContentQuiz ? (
                <button
                  onClick={() => navigate(detailPathForContent(feature, contentSlug))}
                  className="parenting-quiz-btn parenting-quiz-btn-primary"
                >
                  Kembali ke Materi
                </button>
              ) : (
                <button onClick={() => navigate('/kuis-parenting')} className="parenting-quiz-btn parenting-quiz-btn-primary">
                  Kuis Lainnya
                </button>
              )}
            </div>

            <div className="parenting-quiz-review">
              <h3>Review Jawaban</h3>
              <ul className="parenting-quiz-review-list">
                {topic.questions.map((item, idx) => {
                  const selectedIndex = selectedAnswers[idx];
                  const isCorrect = selectedIndex === item.answer;
                  return (
                    <li key={`${item.text}-${idx}`} className={isCorrect ? 'ok' : 'bad'}>
                      <p className="parenting-quiz-review-question">{idx + 1}. {item.text}</p>
                      <p>
                        Jawaban kamu: <strong>{selectedIndex !== undefined ? item.options[selectedIndex] : '-'}</strong>
                      </p>
                      <p>
                        Jawaban benar: <strong>{item.options[item.answer]}</strong>
                      </p>
                      <p className="parenting-quiz-review-explanation">{item.explanation}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="parenting-quiz-play-page">
      <div className="container parenting-quiz-play-shell">
        <button
          type="button"
          onClick={() => navigate(isContentQuiz ? detailPathForContent(feature, contentSlug) : '/kuis-parenting')}
          className="parenting-quiz-back-btn"
        >
          <ArrowLeft size={16} /> {isContentQuiz ? 'Kembali ke materi' : 'Kembali ke daftar kuis'}
        </button>

        <div className="glass-card parenting-quiz-header">
          <p className="parenting-quiz-kicker">{isContentQuiz ? 'Kuis Materi Konten' : 'Kuis Parenting'}</p>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>

          <div className="parenting-quiz-progress-track">
            <div className="parenting-quiz-progress-value" style={{ width: `${progress}%`, backgroundColor: topic.accent }} />
          </div>
          <span className="parenting-quiz-progress-text">
            Pertanyaan {currentIndex + 1} dari {topic.questions.length}
          </span>
        </div>

        <div className="glass-card parenting-quiz-question-card">
          <h2>{question.text}</h2>
          <div className="parenting-quiz-options">
            {question.options.map((option, idx) => {
              const isActive = selected === idx;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={isActive ? 'parenting-quiz-option parenting-quiz-option-active' : 'parenting-quiz-option'}
                >
                  {isActive ? <CheckCircle2 size={18} color={topic.accent} /> : <Circle size={18} color="#64748b" />}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className={selected === question.answer ? 'parenting-quiz-feedback ok' : 'parenting-quiz-feedback bad'}>
              {selected === question.answer ? <CheckCircle2 size={16} /> : <CircleX size={16} />}
              <span>{question.explanation}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={selected === null}
            className="parenting-quiz-btn parenting-quiz-btn-primary parenting-quiz-next"
          >
            {currentIndex === topic.questions.length - 1 ? 'Lihat Hasil' : 'Lanjut Pertanyaan'}
          </button>

          <div className="parenting-quiz-history-wrap">
            <h3>Riwayat Skor Kamu</h3>
            {historyLoading ? (
              <p>Memuat riwayat skor...</p>
            ) : history.length === 0 ? (
              <p>Belum ada riwayat skor untuk topik ini.</p>
            ) : (
              <ul className="parenting-quiz-history-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <span>{item.score}/{item.total}</span>
                    <small>{new Date(item.created_at).toLocaleString('id-ID')}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
