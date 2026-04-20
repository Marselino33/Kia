import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Award, RotateCcw, Play, Activity } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import AdminBar from '../../components/AdminBar';
import '../../styles/pages/quiz-quiz-page.css';

// parenting constants for tabs and activities
const AGE_STAGES = [{
  key: '0-3',
  label: '0-3 Bulan'
}, {
  key: '4-6',
  label: '4-6 Bulan'
}, {
  key: '7-9',
  label: '7-9 Bulan'
}, {
  key: '10-12',
  label: '10-12 Bulan'
}, {
  key: '1-2',
  label: '1-2 Tahun'
}, {
  key: '2-3',
  label: '2-3 Tahun'
}];
const PARENTING_DATA = {
  '0-3': {
    featured: {
      title: 'Main Cilukba (Peek-a-boo)',
      duration: '10 Menit',
      category: 'Kognitif',
      image: 'https://images.unsplash.com/photo-1503454537688-e47a98d86367?auto=format&fit=crop&q=80&w=600',
      instructions: ['Dudukkan bayi di posisi yang nyaman atau lingkarkan telentang.', 'Tutup wajah Anda dengan telapak tangan atau kain lembut.', 'Buka tangan sambil mengucapkan "Cilukba!" dengan nada ceria.'],
      equipment: [{
        icon: 'ðŸ§µ',
        label: 'Kain Lembut'
      }, {
        icon: 'ðŸŽ‰',
        label: 'Mainan Bunyi'
      }],
      expectation: 'Bayi mulai memahami konsep keberadaan objek (object permanence) dan merespon dengan tawa atau gerakan tangan.'
    },
    activities: [{
      id: 1,
      title: 'Merayap Ceria',
      duration: '15 Menit',
      category: 'Motorik'
    }, {
      id: 2,
      title: 'Melihat Cermin',
      duration: '5 Menit',
      category: 'Sensori'
    }, {
      id: 3,
      title: 'Genggam Mainan',
      duration: '10 Menit',
      category: 'Motorik Halus'
    }],
    milestones: [{
      text: 'Bisa mengangkat kepala saat tengkurap'
    }, {
      text: 'Merespon suara dengan menoleh'
    }, {
      text: 'Mulai tersenyum saat diajak bicara'
    }, {
      text: 'Mengikuti gerakan objek dengan mata'
    }]
  },
  // other stages can be filled later with placeholder data
  '4-6': {
    featured: {
      title: '',
      duration: '',
      category: '',
      image: '',
      instructions: [],
      equipment: [],
      expectation: ''
    },
    activities: [],
    milestones: []
  },
  '7-9': {
    featured: {
      title: '',
      duration: '',
      category: '',
      image: '',
      instructions: [],
      equipment: [],
      expectation: ''
    },
    activities: [],
    milestones: []
  },
  '10-12': {
    featured: {
      title: '',
      duration: '',
      category: '',
      image: '',
      instructions: [],
      equipment: [],
      expectation: ''
    },
    activities: [],
    milestones: []
  },
  '1-2': {
    featured: {
      title: '',
      duration: '',
      category: '',
      image: '',
      instructions: [],
      equipment: [],
      expectation: ''
    },
    activities: [],
    milestones: []
  },
  '2-3': {
    featured: {
      title: '',
      duration: '',
      category: '',
      image: '',
      instructions: [],
      equipment: [],
      expectation: ''
    },
    activities: [],
    milestones: []
  }
};
function QuizCard({
  quiz,
  onStart
}) {
  return <div className="glass-card isx-quizpage-1">
            <div className="badge badge-purple isx-quizpage-2">{quiz.category}</div>
            <h2 className="isx-quizpage-3">{quiz.title}</h2>
            <p className="isx-quizpage-4">{quiz.description}</p>
            <div className="isx-quizpage-5">
                <span className="isx-quizpage-6">{quiz.questions.length} pertanyaan</span>
                <button onClick={() => onStart(quiz)} className="btn btn-primary btn-sm">
                    Mulai Kuis <ChevronRight size={14} />
                </button>
            </div>
        </div>;
}
export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // parenting UI state
  const [activeStage, setActiveStage] = useState('0-3');
  const [checkedMilestones, setCheckedMilestones] = useState({});
  const stage = PARENTING_DATA[activeStage];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/quiz')
        const rows = Array.isArray(res?.data?.data) ? res.data.data : []
        setQuizzes(rows.map((item) => ({
          id: item.id,
          title: item.judul,
          description: item.deskripsi || '',
          category: item.kategori || 'Umum',
          questions: (item.pertanyaan || []).map((question) => ({
            id: question.id,
            text: question.teks,
            options: Array.isArray(question.pilihan) ? question.pilihan : (question.pilihan || '').split('|').filter(Boolean),
            correct: 0,
            explanation: question.penjelasan || '',
          })),
        })))
      } catch {
        setQuizzes([])
      }
    }

    load()
  }, [])
  const toggleMilestone = idx => {
    const key = `${activeStage}-${idx}`;
    setCheckedMilestones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const startQuiz = quiz => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setScore(0);
  };
  const selectAnswer = idx => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === activeQuiz.questions[currentQ].correct;
    setAnswers(prev => [...prev, {
      idx,
      correct: isCorrect
    }]);
  };
  const next = () => {
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const total = answers.filter(a => a.correct).length + (selected === activeQuiz.questions[currentQ].correct ? 1 : 0);
      const finalScore = Math.round(total / activeQuiz.questions.length * 100);
      setScore(finalScore);
      setFinished(true);
      api.post('/quizzes/attempt', {
        quiz_id: activeQuiz.id,
        score: finalScore
      }).catch(() => {});
      if (finalScore >= 80) toast.success(`Hebat! Skor Anda ${finalScore} ðŸŽ‰`);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
    }
  };
  const q = activeQuiz?.questions[currentQ];
  const correctCount = answers.filter(a => a.correct).length;

  // helper rendering function for parenting section
  const renderParenting = () => <div>
            {/* age tabs */}
            <div className="container isx-quizpage-7">
                <div className="isx-quizpage-8">
                    {AGE_STAGES.map(s => <button key={s.key} onClick={() => setActiveStage(s.key)} className={activeStage === s.key ? "isx-quizpage-9 isx-quizpage-9--on" : "isx-quizpage-9 isx-quizpage-9--off"}>
                            {s.label}
                        </button>)}
                </div>

                {/* main parenting grid */}
                <div className="isx-quizpage-10">
                    {/* left content */}
                    <div>
                        {/* video card */}
                        <div className="isx-quizpage-11">
                            <img src={stage.featured.image} alt={stage.featured.title} className="isx-quizpage-12" />
                            <button className="isx-quizpage-13">
                                <div className="isx-quizpage-14">
                                    <Play size={28} color="white" />
                                </div>
                            </button>
                        </div>

                        {/* details cards */}
                        <div className="isx-quizpage-15">
                            <div className="isx-quizpage-16">
                                <h4 className="isx-quizpage-17">ðŸ“‹ Instruksi Bermain</h4>
                                <ol className="isx-quizpage-18">
                                    {stage.featured.instructions.map((instr, i) => <li key={i} className="isx-quizpage-19">{instr}</li>)}
                                </ol>
                            </div>
                            <div className="isx-quizpage-20">
                                <h4 className="isx-quizpage-21">ðŸŽ Peralatan</h4>
                                <div className="isx-quizpage-22">
                                    {stage.featured.equipment.map((eq, i) => <div key={i} className="isx-quizpage-23">
                                            <span className="isx-quizpage-24">{eq.icon}</span>
                                            <span className="isx-quizpage-25">{eq.label}</span>
                                        </div>)}
                                </div>
                            </div>
                        </div>

                        <div className="isx-quizpage-26">
                            <h4 className="isx-quizpage-27">ðŸ“ˆ Ekspektasi</h4>
                            <p className="isx-quizpage-28">{stage.featured.expectation}</p>
                        </div>
                    </div>

                    {/* right checklist */}
                    <div className="isx-quizpage-29">
                        <h3 className="isx-quizpage-30">
                            <CheckCircle size={20} /> Ceklis Milestone {activeStage} Bulan
                        </h3>
                        <div className="isx-quizpage-31">
                            {stage.milestones.map((ms, i) => <label key={i} className="isx-quizpage-32">
                                    <input type="checkbox" checked={checkedMilestones[`${activeStage}-${i}`] || false} onChange={() => toggleMilestone(i)} className="isx-quizpage-33" />
                                    <span className="isx-quizpage-34">{ms.text}</span>
                                </label>)}
                        </div>
                        <button className="isx-quizpage-35">
                            Simpan Progress
                        </button>
                    </div>
                </div>
            </div>
        </div>;

  // existing quiz logic continues below

  const progress = activeQuiz ? currentQ / activeQuiz.questions.length * 100 : 0;
  return <div className="isx-quizpage-36">
            <AdminBar label="Tambah Quiz" onClick={() => {}} />
            {renderParenting()}

            {/* quiz content area */}
            {!activeQuiz ? <div>
                    <div className="isx-quizpage-37">
                        <div className="container">
                            <h1 className="isx-quizpage-38">
                                <Activity size={24} className="isx-quizpage-39" />
                                Kuis Edukasi
                            </h1>
                            <p className="isx-quizpage-40">Uji pemahaman Anda dan tingkatkan pengetahuan kesehatan ibu & anak</p>
                        </div>
                    </div>
                    <div className="container isx-quizpage-41">
                        <div className="grid-3">
                            {quizzes.map(q => <QuizCard key={q.id} quiz={q} onStart={startQuiz} />)}
                        </div>
                    </div>
                </div> : finished ? <div className="isx-quizpage-42">
                    <div className="glass-card animate-slideUp isx-quizpage-43">
                        <div className={score >= 80 ? "isx-quizpage-44 isx-quizpage-44--on" : "isx-quizpage-44 isx-quizpage-44--off"}>
                            <Award size={40} color={score >= 80 ? '#14b8a6' : '#f59e0b'} />
                        </div>
                        <h2 className="isx-quizpage-45">{score >= 80 ? 'Luar Biasa! ðŸŽ‰' : 'Terus Belajar! ðŸ’ª'}</h2>
                        <div className="isx-quizpage-46">{score}</div>
                        <p className="isx-quizpage-47">Jawaban benar: <strong className="isx-quizpage-48">{correctCount} / {activeQuiz.questions.length}</strong></p>
                        <p className="isx-quizpage-49">
                            {score >= 80 ? 'Pengetahuan Anda tentang topik ini sangat baik! Lanjutkan ke kuis berikutnya.' : 'Baca kembali artikel terkait untuk meningkatkan pemahaman Anda.'}
                        </p>
                        <div className="isx-quizpage-50">
                            <button onClick={() => startQuiz(activeQuiz)} className="btn btn-secondary"><RotateCcw size={15} /> Ulangi</button>
                            <button onClick={() => setActiveQuiz(null)} className="btn btn-primary">Kuis Lainnya <ChevronRight size={15} /></button>
                        </div>
                    </div>
                </div> : <div className="isx-quizpage-51">
                    <div className="animate-fadeIn isx-quizpage-52">
                        {/* Header + progress info unchanged */}
                        <div className="isx-quizpage-53">
                            <div>
                                <h2 className="isx-quizpage-54">{activeQuiz.title}</h2>
                                <p className="isx-quizpage-55">Pertanyaan {currentQ + 1} dari {activeQuiz.questions.length}</p>
                            </div>
                            <button onClick={() => setActiveQuiz(null)} className="btn btn-ghost isx-quizpage-56">Keluar</button>
                        </div>

                        {/* progress bar */}
                        <div className="isx-quizpage-57">
                          <progress className="isx-quizpage-progress" value={progress} max={100} />
                        </div>

                        {/* question card with pink header */}
                        <div className="isx-quizpage-58">
                            <div className="isx-quizpage-59">
                                <span className="isx-quizpage-60">MODULE 01 QUIZ</span>
                                <span className="isx-quizpage-61">Question {currentQ + 1} of {activeQuiz.questions.length}</span>
                            </div>
                            <div className="isx-quizpage-62">
                                <h3 className="isx-quizpage-63">{q?.text}</h3>
                                <div className="isx-quizpage-64">
                                        {q?.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === q.correct;
                const optionClass = selected !== null ? isCorrect ? 'isx-quizpage-option isx-quizpage-option-correct isx-quizpage-option-locked' : isSelected ? 'isx-quizpage-option isx-quizpage-option-wrong isx-quizpage-option-locked' : 'isx-quizpage-option isx-quizpage-option-locked' : isSelected ? 'isx-quizpage-option isx-quizpage-option-selected' : 'isx-quizpage-option';
                return <button key={idx} onClick={() => selectAnswer(idx)} className={optionClass}>
                                                <span>{opt}</span>
                                                {selected !== null && isCorrect && <CheckCircle size={16} color="#15803d" />}
                                                {selected !== null && isSelected && !isCorrect && <XCircle size={16} color="#b91c1c" />}
                                            </button>;
              })}
                                </div>
                            </div>
                        </div>

                        {/* explanation and next button unchanged */}
                        {selected !== null && <div className="animate-slideUp isx-quizpage-65">
                                <p className="isx-quizpage-66">
                                    ðŸ’¡ <strong className="isx-quizpage-67">Penjelasan:</strong> {q?.explanation}
                                </p>
                            </div>}

                        {selected !== null && <button onClick={next} className="btn btn-primary isx-quizpage-68">
                                {currentQ + 1 >= activeQuiz.questions.length ? 'Lihat Hasil' : 'Lanjut'} <ChevronRight size={16} />
                            </button>}
                    </div>
                </div>}
        </div>;
}