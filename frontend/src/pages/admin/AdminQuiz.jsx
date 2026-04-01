import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Brain, ChevronDown, ChevronUp } from 'lucide-react'
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'

const EMPTY_QUIZ = { judul: '', deskripsi: '', kategori: '', phase: '', is_published: true }
const EMPTY_Q = { teks: '', pilihan: '', jawaban_benar: '', penjelasan: '', urutan: 0 }

export default function AdminQuiz() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY_QUIZ)
    const [saving, setSaving] = useState(false)
    const [expandedId, setExpandedId] = useState(null)
    const [qModal, setQModal] = useState(false)
    const [qForm, setQForm] = useState(EMPTY_Q)
    const [qParentId, setQParentId] = useState(null)

    const fetchData = () => {
        setLoading(true)
        adminApi.get('/admin/quiz')
            .then(r => setList(r.data?.data || []))
            .catch(() => toast.error('Gagal memuat quiz'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const openCreate = () => { setForm(EMPTY_QUIZ); setSelected(null); setModal('create') }
    const openEdit = (item) => { setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori: item.kategori || '', phase: item.phase || '', is_published: item.is_published !== false }); setSelected(item); setModal('edit') }
    const openDelete = (item) => { setSelected(item); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }
    const setF = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(p => ({ ...p, [e.target.name]: val }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.judul) { toast.error('Judul wajib diisi'); return }
        setSaving(true)
        try {
            if (modal === 'create') {
                await adminApi.post('/admin/quiz', form)
                toast.success('Quiz berhasil ditambahkan')
            } else {
                await adminApi.put(`/admin/quiz/${selected.id}`, form)
                toast.success('Quiz berhasil diperbarui')
            }
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan')
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setSaving(true)
        try {
            await adminApi.delete(`/admin/quiz/${selected.id}`)
            toast.success('Quiz berhasil dihapus')
            closeModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus')
        } finally { setSaving(false) }
    }

    // Question management
    const openAddQuestion = (quizId) => { setQParentId(quizId); setQForm({ ...EMPTY_Q, urutan: 0 }); setQModal(true) }
    const closeQModal = () => { setQModal(false); setQParentId(null) }

    const handleAddQuestion = async (e) => {
        e.preventDefault()
        if (!qForm.teks || !qForm.pilihan || !qForm.jawaban_benar) { toast.error('Pertanyaan, pilihan, dan jawaban benar wajib diisi'); return }
        setSaving(true)
        try {
            await adminApi.post(`/admin/quiz/${qParentId}/questions`, { ...qForm, urutan: parseInt(qForm.urutan) || 0 })
            toast.success('Pertanyaan berhasil ditambahkan')
            closeQModal(); fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan pertanyaan')
        } finally { setSaving(false) }
    }

    const handleDeleteQuestion = async (quizId, qid) => {
        if (!confirm('Hapus pertanyaan ini?')) return
        try {
            await adminApi.delete(`/admin/quiz/${quizId}/questions/${qid}`)
            toast.success('Pertanyaan dihapus')
            fetchData()
        } catch (err) {
            toast.error('Gagal menghapus pertanyaan')
        }
    }

    const filtered = list.filter(q => q.judul?.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminLayout>
            <AdminPageHeader title="Manajemen Quiz" subtitle={`${list.length} quiz`}
                action={<button onClick={openCreate} style={btnP}><Plus size={16} /> Tambah Quiz</button>} />
            <div style={{ padding: '2rem' }}>
                <AdminCard>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari judul quiz..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.875rem', flex: 1 }} />
                    </div>
                    {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
                        : filtered.length === 0 ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}><Brain size={32} /><p>Tidak ada quiz</p></div>
                            : <div>
                                {filtered.map(q => (
                                    <div key={q.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        {/* Quiz row */}
                                        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: '0.25rem' }}>
                                                {expandedId === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{q.judul}</span>
                                                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>{q.kategori} {q.phase && `· ${q.phase}`}</span>
                                                <span style={{ marginLeft: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: q.is_published !== false ? '#10b98120' : '#94a3b820', color: q.is_published !== false ? '#10b981' : '#94a3b8', border: `1px solid ${q.is_published !== false ? '#10b98140' : '#94a3b840'}` }}>
                                                    {q.is_published !== false ? 'Publik' : 'Draft'}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{q.pertanyaan?.length || 0} soal</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openAddQuestion(q.id)} style={{ ...btnE, background: '#f0fdf4', borderColor: '#bbf7d0', color: '#10b981' }}><Plus size={14} /></button>
                                                <button onClick={() => openEdit(q)} style={btnE}><Pencil size={14} /></button>
                                                <button onClick={() => openDelete(q)} style={btnD}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        {/* Questions expanded */}
                                        {expandedId === q.id && (
                                            <div style={{ background: '#f8fafc', padding: '0.75rem 1.5rem 0.75rem 3.5rem' }}>
                                                {!q.pertanyaan?.length ? (
                                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Belum ada pertanyaan. Klik + untuk menambah.</p>
                                                ) : q.pertanyaan.map((pt, idx) => (
                                                    <div key={pt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#6366f120', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>{pt.teks}</p>
                                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Jawaban: <strong style={{ color: '#10b981' }}>{pt.jawaban_benar}</strong></p>
                                                        </div>
                                                        <button onClick={() => handleDeleteQuestion(q.id, pt.id)} style={{ ...btnD, padding: '0.3rem' }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>}
                </AdminCard>
            </div>

            {/* Quiz form modal */}
            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Quiz' : 'Edit Quiz'}>
                <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                    <AdminInput label="Judul Quiz" name="judul" value={form.judul} required onChange={setF} placeholder="Judul quiz" />
                    <AdminInput label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={setF} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                        <AdminInput label="Kategori" name="kategori" value={form.kategori} onChange={setF} placeholder="Imunisasi" />
                        <AdminInput label="Phase" name="phase" value={form.phase} onChange={setF} placeholder="bayi" />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan quiz ini
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeModal} style={btnC}>Batal</button>
                        <button type="submit" style={btnP} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Add Question modal */}
            <AdminModal open={qModal} onClose={closeQModal} title="Tambah Pertanyaan">
                <form onSubmit={handleAddQuestion} style={{ padding: '1.5rem' }}>
                    <AdminInput label="Teks Pertanyaan" name="teks" type="textarea" value={qForm.teks} required onChange={e => setQForm(p => ({ ...p, teks: e.target.value }))} placeholder="Pertanyaan..." />
                    <AdminInput label="Pilihan Jawaban (pisahkan dengan |)" name="pilihan" value={qForm.pilihan} required onChange={e => setQForm(p => ({ ...p, pilihan: e.target.value }))} placeholder="A|B|C|D" />
                    <AdminInput label="Jawaban Benar" name="jawaban_benar" value={qForm.jawaban_benar} required onChange={e => setQForm(p => ({ ...p, jawaban_benar: e.target.value }))} placeholder="A" />
                    <AdminInput label="Penjelasan" name="penjelasan" type="textarea" value={qForm.penjelasan} onChange={e => setQForm(p => ({ ...p, penjelasan: e.target.value }))} placeholder="Penjelasan jawaban (opsional)" />
                    <AdminInput label="Urutan" name="urutan" type="number" value={qForm.urutan} onChange={e => setQForm(p => ({ ...p, urutan: e.target.value }))} min={0} />
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeQModal} style={btnC}>Batal</button>
                        <button type="submit" style={btnP} disabled={saving}>{saving ? 'Menyimpan...' : 'Tambah'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Modal */}
            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Quiz" width={400}>
                <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Hapus quiz <strong>{selected?.judul}</strong> beserta semua pertanyaannya?</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={closeModal} style={btnC}>Batal</button>
                        <button onClick={handleDelete} style={btnX} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    )
}

const btnP = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #E8307D, #f472b6)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
const btnE = { padding: '0.4rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.4rem', cursor: 'pointer', color: '#0ea5e9', display: 'flex' }
const btnD = { padding: '0.4rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex' }
const btnC = { padding: '0.6rem 1.25rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }
const btnX = { padding: '0.6rem 1.25rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }
