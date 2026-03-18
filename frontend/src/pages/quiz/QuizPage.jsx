import { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight, Award, RotateCcw, Play, Activity } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import AdminBar from '../../components/AdminBar'

// parenting constants for tabs and activities
const AGE_STAGES = [
    { key: '0-3', label: '0-3 Bulan' },
    { key: '4-6', label: '4-6 Bulan' },
    { key: '7-9', label: '7-9 Bulan' },
    { key: '10-12', label: '10-12 Bulan' },
    { key: '1-2', label: '1-2 Tahun' },
    { key: '2-3', label: '2-3 Tahun' },
]

const PARENTING_DATA = {
    '0-3': {
        featured: {
            title: 'Main Cilukba (Peek-a-boo)',
            duration: '10 Menit',
            category: 'Kognitif',
            image: 'https://images.unsplash.com/photo-1503454537688-e47a98d86367?auto=format&fit=crop&q=80&w=600',
            instructions: [
                'Dudukkan bayi di posisi yang nyaman atau lingkarkan telentang.',
                'Tutup wajah Anda dengan telapak tangan atau kain lembut.',
                'Buka tangan sambil mengucapkan "Cilukba!" dengan nada ceria.'
            ],
            equipment: [
                { icon: '🧵', label: 'Kain Lembut' },
                { icon: '🎉', label: 'Mainan Bunyi' }
            ],
            expectation: 'Bayi mulai memahami konsep keberadaan objek (object permanence) dan merespon dengan tawa atau gerakan tangan.'
        },
        activities: [
            { id: 1, title: 'Merayap Ceria', duration: '15 Menit', category: 'Motorik' },
            { id: 2, title: 'Melihat Cermin', duration: '5 Menit', category: 'Sensori' },
            { id: 3, title: 'Genggam Mainan', duration: '10 Menit', category: 'Motorik Halus' },
        ],
        milestones: [
            { text: 'Bisa mengangkat kepala saat tengkurap' },
            { text: 'Merespon suara dengan menoleh' },
            { text: 'Mulai tersenyum saat diajak bicara' },
            { text: 'Mengikuti gerakan objek dengan mata' }
        ]
    },
    // other stages can be filled later with placeholder data
    '4-6': {
        featured: { title: '', duration: '', category: '', image: '', instructions: [], equipment: [], expectation: '' },
        activities: [], milestones: []
    },
    '7-9': { featured: { title: '', duration: '', category: '', image: '', instructions: [], equipment: [], expectation: '' }, activities: [], milestones: [] },
    '10-12': { featured: { title: '', duration: '', category: '', image: '', instructions: [], equipment: [], expectation: '' }, activities: [], milestones: [] },
    '1-2': { featured: { title: '', duration: '', category: '', image: '', instructions: [], equipment: [], expectation: '' }, activities: [], milestones: [] },
    '2-3': { featured: { title: '', duration: '', category: '', image: '', instructions: [], equipment: [], expectation: '' }, activities: [], milestones: [] },
}

const QUIZZES = [
    {
        id: 1,
        title: 'Nutrisi Ibu Hamil',
        description: 'Uji pengetahuan Anda tentang asupan gizi selama kehamilan.',
        category: 'Gizi',
        questions: [
            { id: 1, text: 'Berapa dosis asam folat yang dianjurkan per hari untuk ibu hamil?', options: ['100 mcg', '200 mcg', '400-600 mcg', '1000 mcg'], correct: 2, explanation: 'WHO dan Kemenkes merekomendasikan 400-600 mcg asam folat per hari untuk mencegah cacat neural tube.' },
            { id: 2, text: 'Zat gizi apa yang paling penting untuk mencegah anemia pada ibu hamil?', options: ['Vitamin C', 'Zat Besi (Fe)', 'Kalsium', 'Zinc'], correct: 1, explanation: 'Zat besi dibutuhkan untuk produksi hemoglobin. Ibu hamil membutuhkan 27mg zat besi per hari.' },
            { id: 3, text: 'Berat badan ideal yang harus naik selama kehamilan (BMI normal) adalah...', options: ['2-5 kg', '5-9 kg', '11.5-16 kg', '20-25 kg'], correct: 2, explanation: 'Untuk ibu dengan BMI normal (18.5-24.9), kenaikan berat badan ideal 11.5-16 kg selama kehamilan.' },
        ],
    },
    {
        id: 2,
        title: 'Imunisasi Dasar Bayi',
        description: 'Seberapa jauh Anda tahu tentang jadwal imunisasi bayi?',
        category: 'Imunisasi',
        questions: [
            { id: 1, text: 'Imunisasi apa yang diberikan pertama kali saat bayi lahir?', options: ['BCG saja', 'Polio saja', 'HB-0, BCG, dan Polio 0', 'DPT-HB-Hib'], correct: 2, explanation: 'Segera setelah lahir, bayi mendapat HB-0 (Hepatitis B), BCG (TBC), dan Polio 0.' },
            { id: 2, text: 'Pada usia berapa imunisasi Campak-Rubella pertama diberikan?', options: ['6 bulan', '9 bulan', '12 bulan', '18 bulan'], correct: 1, explanation: 'Imunisasi Campak-Rubella (MR) pertama diberikan pada usia 9 bulan.' },
            { id: 3, text: 'Imunisasi DPT melindungi anak dari penyakit...', options: ['Difteri, Polio, Tetanus', 'Difteri, Pertusis, Tetanus', 'Dengue, Pneumo, Typhoid', 'Difteri, Polio, Tifoid'], correct: 1, explanation: 'DPT adalah singkatan dari Difteri, Pertusis (batuk rejan), dan Tetanus.' },
        ],
    },
]

function QuizCard({ quiz, onStart }) {
    return (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div className="badge badge-purple" style={{ marginBottom: '0.875rem', display: 'inline-flex' }}>{quiz.category}</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{quiz.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>{quiz.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{quiz.questions.length} pertanyaan</span>
                <button onClick={() => onStart(quiz)} className="btn btn-primary btn-sm">
                    Mulai Kuis <ChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}

export default function QuizPage() {
    const [activeQuiz, setActiveQuiz] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState([])
    const [finished, setFinished] = useState(false)
    const [score, setScore] = useState(0)

    // parenting UI state
    const [activeStage, setActiveStage] = useState('0-3')
    const [checkedMilestones, setCheckedMilestones] = useState({})
    const stage = PARENTING_DATA[activeStage]
    const toggleMilestone = (idx) => {
        const key = `${activeStage}-${idx}`
        setCheckedMilestones(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz)
        setCurrentQ(0)
        setSelected(null)
        setAnswers([])
        setFinished(false)
        setScore(0)
    }

    const selectAnswer = (idx) => {
        if (selected !== null) return
        setSelected(idx)
        const isCorrect = idx === activeQuiz.questions[currentQ].correct
        setAnswers(prev => [...prev, { idx, correct: isCorrect }])
    }

    const next = () => {
        if (currentQ + 1 >= activeQuiz.questions.length) {
            const total = answers.filter(a => a.correct).length + (selected === activeQuiz.questions[currentQ].correct ? 1 : 0)
            const finalScore = Math.round((total / activeQuiz.questions.length) * 100)
            setScore(finalScore)
            setFinished(true)
            api.post('/quizzes/attempt', { quiz_id: activeQuiz.id, score: finalScore }).catch(() => { })
            if (finalScore >= 80) toast.success(`Hebat! Skor Anda ${finalScore} 🎉`)
        } else {
            setCurrentQ(c => c + 1)
            setSelected(null)
        }
    }

    const q = activeQuiz?.questions[currentQ]
    const correctCount = answers.filter(a => a.correct).length

    // helper rendering function for parenting section
    const renderParenting = () => (
        <div>
            {/* age tabs */}
            <div className="container" style={{ paddingBlock: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {AGE_STAGES.map(s => (
                        <button
                            key={s.key}
                            onClick={() => setActiveStage(s.key)}
                            style={{
                                padding: '0.6rem 1.25rem', borderRadius: '30px', border: 'none',
                                background: activeStage === s.key ? '#f472b6' : '#fff',
                                color: activeStage === s.key ? '#fff' : '#6b7280',
                                fontWeight: activeStage === s.key ? 700 : 500,
                                fontSize: '0.9rem', cursor: 'pointer',
                                transition: 'all 0.2s', flexShrink: 0
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* main parenting grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start', marginTop: '1.5rem' }}>
                    {/* left content */}
                    <div>
                        {/* video card */}
                        <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', height: 220, background: '#e5e7eb', cursor: 'pointer' }}>
                            <img src={stage.featured.image} alt={stage.featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button style={{ position: 'absolute', inset: 0, background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={28} color="white" />
                                </div>
                            </button>
                        </div>

                        {/* details cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ background: '#fff', padding: '1rem', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>📋 Instruksi Bermain</h4>
                                <ol style={{ paddingLeft: '1.25rem', margin: 0, color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                    {stage.featured.instructions.map((instr,i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{instr}</li>)}
                                </ol>
                            </div>
                            <div style={{ background: '#fff', padding: '1rem', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>🎁 Peralatan</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {stage.featured.equipment.map((eq,i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem' }}>{eq.icon}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{eq.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '1rem', borderRadius: '1rem', border: '1px solid #f3f4f6', marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>📈 Ekspektasi</h4>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{stage.featured.expectation}</p>
                        </div>
                    </div>

                    {/* right checklist */}
                    <div style={{ background: '#f472b6', padding: '1.25rem', borderRadius: '1.25rem', color: '#fff', position: 'sticky', top: '90px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} /> Ceklis Milestone {activeStage} Bulan
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                            {stage.milestones.map((ms,i) => (
                                <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                                    <input type="checkbox" checked={checkedMilestones[`${activeStage}-${i}`]||false} onChange={() => toggleMilestone(i)} style={{ accentColor:'#fff', cursor:'pointer' }} />
                                    <span style={{ fontSize:'0.9rem' }}>{ms.text}</span>
                                </label>
                            ))}
                        </div>
                        <button style={{ width:'100%', background:'#fff', color:'#f472b6', border:'none', padding:'0.75rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer' }}>
                            Simpan Progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    // existing quiz logic continues below

    const progress = activeQuiz ? ((currentQ) / activeQuiz.questions.length) * 100 : 0

    return (
        <div style={{ paddingTop: 72 }}>
            <AdminBar label="Tambah Quiz" onClick={() => { }} />
            {renderParenting()}

            {/* quiz content area */}
            {!activeQuiz ? (
                <div>
                    <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '2.5rem 0' }}>
                        <div className="container">
                            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700 }}>
                                <Activity size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary-400)', verticalAlign: 'middle' }} />
                                Kuis Edukasi
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Uji pemahaman Anda dan tingkatkan pengetahuan kesehatan ibu & anak</p>
                        </div>
                    </div>
                    <div className="container" style={{ paddingBlock: '2rem' }}>
                        <div className="grid-3">
                            {QUIZZES.map(q => <QuizCard key={q.id} quiz={q} onStart={startQuiz} />)}
                        </div>
                    </div>
                </div>
            ) : finished ? (
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="glass-card animate-slideUp" style={{ maxWidth: 480, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: score >= 80 ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Award size={40} color={score >= 80 ? '#14b8a6' : '#f59e0b'} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{score >= 80 ? 'Luar Biasa! 🎉' : 'Terus Belajar! 💪'}</h2>
                        <div style={{ fontSize: '3rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '1rem 0' }}>{score}</div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>Jawaban benar: <strong style={{ color: 'var(--text-primary)' }}>{correctCount} / {activeQuiz.questions.length}</strong></p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                            {score >= 80 ? 'Pengetahuan Anda tentang topik ini sangat baik! Lanjutkan ke kuis berikutnya.' : 'Baca kembali artikel terkait untuk meningkatkan pemahaman Anda.'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => startQuiz(activeQuiz)} className="btn btn-secondary"><RotateCcw size={15} /> Ulangi</button>
                            <button onClick={() => setActiveQuiz(null)} className="btn btn-primary">Kuis Lainnya <ChevronRight size={15} /></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                    <div style={{ width: '100%', maxWidth: 640 }} className="animate-fadeIn">
                        {/* Header + progress info unchanged */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{activeQuiz.title}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pertanyaan {currentQ + 1} dari {activeQuiz.questions.length}</p>
                            </div>
                            <button onClick={() => setActiveQuiz(null)} className="btn btn-ghost" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>Keluar</button>
                        </div>

                        {/* progress bar */}
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 'var(--radius-full)', marginBottom: '2rem', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                        </div>

                        {/* question card with pink header */}
                        <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
                            <div style={{ background: '#f472b6', color: '#fff', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>MODULE 01 QUIZ</span>
                                <span style={{ fontSize: '0.8rem' }}>Question {currentQ + 1} of {activeQuiz.questions.length}</span>
                            </div>
                            <div style={{ background: '#fff', padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.5rem', color: '#1f2937' }}>{q?.text}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {q?.options.map((opt, idx) => {
                                        const isSelected = selected === idx
                                        const isCorrect = idx === q.correct
                                        let bg = '#ffffff', border = '1px solid var(--border-color)', color = 'var(--text-secondary)'
                                        if (selected !== null) {
                                            if (isCorrect) { bg = '#f0fdf4'; border = '1px solid #4ade80'; color = '#15803d' }
                                            else if (isSelected) { bg = '#fef2f2'; border = '1px solid #f87171'; color = '#b91c1c' }
                                        } else if (isSelected) { bg = '#fdf2f8'; border = '1px solid #f472b6'; color = 'var(--primary-600)' }
                                        return (
                                            <button key={idx} onClick={() => selectAnswer(idx)} style={{
                                                padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', background: bg, border, color,
                                                textAlign: 'left', fontSize: '0.9rem', fontWeight: 500, cursor: selected !== null ? 'default' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                                                transition: 'all 0.2s',
                                            }}>
                                                <span>{opt}</span>
                                                {selected !== null && isCorrect && <CheckCircle size={16} color="#15803d" />}
                                                {selected !== null && isSelected && !isCorrect && <XCircle size={16} color="#b91c1c" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* explanation and next button unchanged */}
                        {selected !== null && (
                            <div className="animate-slideUp" style={{ padding: '1rem 1.25rem', background: '#f5f3ff', borderRadius: 'var(--radius-md)', border: '1px solid #ddd6fe', marginBottom: '1.25rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                                    💡 <strong style={{ color: 'var(--text-primary)' }}>Penjelasan:</strong> {q?.explanation}
                                </p>
                            </div>
                        )}

                        {selected !== null && (
                            <button onClick={next} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                                {currentQ + 1 >= activeQuiz.questions.length ? 'Lihat Hasil' : 'Lanjut'} <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
