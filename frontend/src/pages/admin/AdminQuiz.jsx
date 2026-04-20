import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-quiz.css';
const EMPTY_QUIZ = {
  judul: '',
  deskripsi: '',
  kategori: '',
  phase: '',
  is_published: true
};
const EMPTY_Q = {
  teks: '',
  pilihan: '',
  jawaban_benar: '',
  penjelasan: '',
  urutan: 0
};
export default function AdminQuiz() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_QUIZ);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [qModal, setQModal] = useState(false);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [qParentId, setQParentId] = useState(null);
  const fetchData = () => {
    setLoading(true);
    adminApi.get('/admin/quiz').then(r => setList(r.data?.data || [])).catch(() => toast.error('Gagal memuat quiz')).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openCreate = () => {
    setForm(EMPTY_QUIZ);
    setSelected(null);
    setModal('create');
  };
  const openEdit = item => {
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori || '',
      phase: item.phase || '',
      is_published: item.is_published !== false
    });
    setSelected(item);
    setModal('edit');
  };
  const openDelete = item => {
    setSelected(item);
    setModal('delete');
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };
  const setF = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({
      ...p,
      [e.target.name]: val
    }));
  };
  const handleSave = async e => {
    e.preventDefault();
    if (!form.judul) {
      toast.error('Judul wajib diisi');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'create') {
        await adminApi.post('/admin/quiz', form);
        toast.success('Quiz berhasil ditambahkan');
      } else {
        await adminApi.put(`/admin/quiz/${selected.id}`, form);
        toast.success('Quiz berhasil diperbarui');
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminApi.delete(`/admin/quiz/${selected.id}`);
      toast.success('Quiz berhasil dihapus');
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };

  // Question management
  const openAddQuestion = quizId => {
    setQParentId(quizId);
    setQForm({
      ...EMPTY_Q,
      urutan: 0
    });
    setQModal(true);
  };
  const closeQModal = () => {
    setQModal(false);
    setQParentId(null);
  };
  const handleAddQuestion = async e => {
    e.preventDefault();
    if (!qForm.teks || !qForm.pilihan || !qForm.jawaban_benar) {
      toast.error('Pertanyaan, pilihan, dan jawaban benar wajib diisi');
      return;
    }
    setSaving(true);
    try {
      await adminApi.post(`/admin/quiz/${qParentId}/questions`, {
        ...qForm,
        urutan: parseInt(qForm.urutan) || 0
      });
      toast.success('Pertanyaan berhasil ditambahkan');
      closeQModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pertanyaan');
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteQuestion = async (quizId, qid) => {
    if (!confirm('Hapus pertanyaan ini?')) return;
    try {
      await adminApi.delete(`/admin/quiz/${quizId}/questions/${qid}`);
      toast.success('Pertanyaan dihapus');
      fetchData();
    } catch (err) {
      toast.error('Gagal menghapus pertanyaan');
    }
  };
  const filtered = list.filter(q => q.judul?.toLowerCase().includes(search.toLowerCase()));
  return <AdminLayout>
            <AdminPageHeader title="Manajemen Quiz" subtitle={`${list.length} quiz`} action={<button onClick={openCreate} className="isx-adminquiz-1"><Plus size={16} /> Tambah Quiz</button>} />
            <div className="isx-adminquiz-2">
                <AdminCard>
                    <div className="isx-adminquiz-3">
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari judul quiz..." value={search} onChange={e => setSearch(e.target.value)} className="isx-adminquiz-4" />
                    </div>
                    {loading ? <div className="isx-adminquiz-5">Memuat...</div> : filtered.length === 0 ? <div className="isx-adminquiz-6"><Brain size={32} /><p>Tidak ada quiz</p></div> : <div>
                                {filtered.map(q => <div key={q.id} className="isx-adminquiz-7">
                                        {/* Quiz row */}
                                        <div className="isx-adminquiz-8">
                                            <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)} className="isx-adminquiz-9">
                                                {expandedId === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            <div className="isx-adminquiz-10">
                                                <span className="isx-adminquiz-11">{q.judul}</span>
                                                <span className="isx-adminquiz-12">{q.kategori} {q.phase && `Â· ${q.phase}`}</span>
                                                <span className={q.is_published !== false ? 'admin-status-pill admin-status-pill-compact admin-status-pill-published' : 'admin-status-pill admin-status-pill-compact admin-status-pill-draft'}>
                                                    {q.is_published !== false ? 'Publik' : 'Draft'}
                                                </span>
                                            </div>
                                            <span className="isx-adminquiz-13">{q.pertanyaan?.length || 0} soal</span>
                                            <div className="isx-adminquiz-14">
                                                <button onClick={() => openAddQuestion(q.id)} className="isx-adminquiz-15"><Plus size={14} /></button>
                                                <button onClick={() => openEdit(q)} className="isx-adminquiz-16"><Pencil size={14} /></button>
                                                <button onClick={() => openDelete(q)} className="isx-adminquiz-17"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        {/* Questions expanded */}
                                        {expandedId === q.id && <div className="isx-adminquiz-18">
                                                {!q.pertanyaan?.length ? <p className="isx-adminquiz-19">Belum ada pertanyaan. Klik + untuk menambah.</p> : q.pertanyaan.map((pt, idx) => <div key={pt.id} className="isx-adminquiz-20">
                                                        <span className="isx-adminquiz-21">{idx + 1}</span>
                                                        <div className="isx-adminquiz-22">
                                                            <p className="isx-adminquiz-23">{pt.teks}</p>
                                                            <p className="isx-adminquiz-24">Jawaban: <strong className="isx-adminquiz-25">{pt.jawaban_benar}</strong></p>
                                                        </div>
                                                        <button onClick={() => handleDeleteQuestion(q.id, pt.id)} className="isx-adminquiz-26"><Trash2 size={12} /></button>
                                                    </div>)}
                                            </div>}
                                    </div>)}
                            </div>}
                </AdminCard>
            </div>

            {/* Quiz form modal */}
            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Quiz' : 'Edit Quiz'}>
                <form onSubmit={handleSave} className="isx-adminquiz-27">
                    <AdminInput label="Judul Quiz" name="judul" value={form.judul} required onChange={setF} placeholder="Judul quiz" />
                    <AdminInput label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={setF} />
                    <div className="isx-adminquiz-28">
                        <AdminInput label="Kategori" name="kategori" value={form.kategori} onChange={setF} placeholder="Imunisasi" />
                        <AdminInput label="Phase" name="phase" value={form.phase} onChange={setF} placeholder="bayi" />
                    </div>
                    <label className="isx-adminquiz-29">
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan quiz ini
                    </label>
                    <div className="isx-adminquiz-30">
                        <button type="button" onClick={closeModal} className="isx-adminquiz-31">Batal</button>
                        <button type="submit" disabled={saving} className="isx-adminquiz-32">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Add Question modal */}
            <AdminModal open={qModal} onClose={closeQModal} title="Tambah Pertanyaan">
                <form onSubmit={handleAddQuestion} className="isx-adminquiz-33">
                    <AdminInput label="Teks Pertanyaan" name="teks" type="textarea" value={qForm.teks} required onChange={e => setQForm(p => ({
          ...p,
          teks: e.target.value
        }))} placeholder="Pertanyaan..." />
                    <AdminInput label="Pilihan Jawaban (pisahkan dengan |)" name="pilihan" value={qForm.pilihan} required onChange={e => setQForm(p => ({
          ...p,
          pilihan: e.target.value
        }))} placeholder="A|B|C|D" />
                    <AdminInput label="Jawaban Benar" name="jawaban_benar" value={qForm.jawaban_benar} required onChange={e => setQForm(p => ({
          ...p,
          jawaban_benar: e.target.value
        }))} placeholder="A" />
                    <AdminInput label="Penjelasan" name="penjelasan" type="textarea" value={qForm.penjelasan} onChange={e => setQForm(p => ({
          ...p,
          penjelasan: e.target.value
        }))} placeholder="Penjelasan jawaban (opsional)" />
                    <AdminInput label="Urutan" name="urutan" type="number" value={qForm.urutan} onChange={e => setQForm(p => ({
          ...p,
          urutan: e.target.value
        }))} min={0} />
                    <div className="isx-adminquiz-34">
                        <button type="button" onClick={closeQModal} className="isx-adminquiz-35">Batal</button>
                        <button type="submit" disabled={saving} className="isx-adminquiz-36">{saving ? 'Menyimpan...' : 'Tambah'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Modal */}
            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Quiz" width={400}>
                <div className="isx-adminquiz-37">
                    <p className="isx-adminquiz-38">Hapus quiz <strong>{selected?.judul}</strong> beserta semua pertanyaannya?</p>
                    <div className="isx-adminquiz-39">
                        <button onClick={closeModal} className="isx-adminquiz-40">Batal</button>
                        <button onClick={handleDelete} disabled={saving} className="isx-adminquiz-41">{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>;
}
const btnP = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.6rem 1.25rem',
  background: 'linear-gradient(135deg, #42a5f5, #1565C0)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};
const btnE = {
  padding: '0.4rem',
  background: '#e3f2fd',
  border: '1px solid #bbdefb',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#1565C0',
  display: 'flex'
};
const btnD = {
  padding: '0.4rem',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#ef4444',
  display: 'flex'
};
const btnC = {
  padding: '0.6rem 1.25rem',
  background: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: '#374151'
};
const btnX = {
  padding: '0.6rem 1.25rem',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};