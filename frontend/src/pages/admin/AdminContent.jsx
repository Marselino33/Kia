import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, FileText } from 'lucide-react';
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-content.css';
const EMPTY = {
  slug: '',
  judul: '',
  ringkasan: '',
  isi: '',
  kategori: '',
  phase: '',
  tags: '',
  gambar_url: '',
  read_minutes: 5,
  is_published: true
};
const KATEGORI = ['Gizi', 'Imunisasi', 'Kesehatan Ibu', 'Tumbuh Kembang', 'PHBS', 'Umum'];
const PHASE = ['kehamilan_1', 'kehamilan_2', 'kehamilan_3', 'bayi', 'baduta', 'balita', 'semua'];

// Wrapper component for category-specific content management
export default function AdminContent({
  categoryFilter,
  pageTitle,
  pageSubtitle
}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    ...EMPTY,
    kategori: categoryFilter || ''
  });
  const [saving, setSaving] = useState(false);
  const fetchData = () => {
    setLoading(true);
    // If categoryFilter is provided, filter by category
    const endpoint = categoryFilter ? `/admin/content?kategori=${encodeURIComponent(categoryFilter)}` : '/admin/content';
    adminApi.get(endpoint).then(r => setList(r.data?.data || [])).catch(() => toast.error('Gagal memuat konten')).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, [categoryFilter]);
  const openCreate = () => {
    setForm({
      ...EMPTY,
      kategori: categoryFilter || ''
    });
    setSelected(null);
    setModal('create');
  };
  const openEdit = item => {
    setForm({
      slug: item.slug,
      judul: item.judul || item.title || '',
      ringkasan: item.ringkasan || item.summary || '',
      isi: item.isi || item.body || '',
      kategori: item.kategori || item.category || categoryFilter || '',
      phase: item.phase || '',
      tags: item.tags || '',
      gambar_url: item.gambar_url || '',
      read_minutes: item.read_minutes || item.readMinutes || 5,
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
  const autoSlug = title => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  const handleSave = async e => {
    e.preventDefault();
    if (!form.judul || !form.slug) {
      toast.error('Judul dan slug wajib diisi');
      return;
    }
    // Ensure category is set
    const payload = {
      ...form,
      read_minutes: parseInt(form.read_minutes) || 5,
      kategori: categoryFilter || form.kategori
    };
    setSaving(true);
    try {
      if (modal === 'create') {
        await adminApi.post('/admin/content', payload);
        toast.success('Konten berhasil ditambahkan');
      } else {
        await adminApi.put(`/admin/content/${selected.id}`, payload);
        toast.success('Konten berhasil diperbarui');
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
      await adminApi.delete(`/admin/content/${selected.id}`);
      toast.success('Konten berhasil dihapus');
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };
  const filtered = list.filter(c => (c.judul || c.title)?.toLowerCase().includes(search.toLowerCase()));

  // Use custom title if provided, otherwise use category
  const title = pageTitle || (categoryFilter ? `Konten ${categoryFilter}` : 'Manajemen Konten');
  const subtitle = pageSubtitle || `${list.length} artikel`;
  return <AdminLayout>
            <AdminPageHeader title={title} subtitle={subtitle} action={<button onClick={openCreate} className="isx-admincontent-1"><Plus size={16} /> Tambah Artikel</button>} />
            <div className="isx-admincontent-2">
                <AdminCard>
                    <div className="isx-admincontent-3">
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari judul artikel..." value={search} onChange={e => setSearch(e.target.value)} className="isx-admincontent-4" />
                    </div>
                    <div className="isx-admincontent-5">
                        {loading ? <div className="isx-admincontent-6">Memuat...</div> : filtered.length === 0 ? <div className="isx-admincontent-7"><FileText size={32} /><p>Tidak ada data</p></div> : <table className="admin-table">
                                    <thead><tr>
                                <th className="admin-th">Judul</th>
                                <th className="admin-th">Slug</th>
                                <th className="admin-th">Phase</th>
                                <th className="admin-th">Status</th>
                                <th className="admin-th admin-th-right">Aksi</th>
                                    </tr></thead>
                                    <tbody>
                                        {filtered.map(c => <tr key={c.id}>
                                    <td className="admin-td admin-td-max220">
                                                    <div className="isx-admincontent-8">{c.judul || c.title}</div>
                                                    <div className="isx-admincontent-9">{c.ringkasan || c.summary}</div>
                                                </td>
                                    <td className="admin-td admin-td-link">{c.slug}</td>
                                    <td className="admin-td">{c.phase || '-'}</td>
                                    <td className="admin-td">
                                      <span className={c.is_published !== false ? 'admin-status-pill admin-status-pill-published' : 'admin-status-pill admin-status-pill-draft'}>
                                                        {c.is_published !== false ? 'Publik' : 'Draft'}
                                                    </span>
                                                </td>
                                    <td className="admin-td admin-td-right">
                                                    <div className="isx-admincontent-10">
                                                        <button onClick={() => openEdit(c)} className="isx-admincontent-11"><Pencil size={14} /></button>
                                                        <button onClick={() => openDelete(c)} className="isx-admincontent-12"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>)}
                                    </tbody>
                                </table>}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Artikel' : 'Edit Artikel'} width={640}>
                <form onSubmit={handleSave} className="isx-admincontent-13">
                    <div className="isx-admincontent-14">
                        <div className="isx-admincontent-15">
                            <AdminInput label="Judul" name="judul" value={form.judul} required onChange={e => {
              setF(e);
              if (!selected) setForm(p => ({
                ...p,
                slug: autoSlug(e.target.value)
              }));
            }} placeholder="Judul artikel" />
                        </div>
                        <AdminInput label="Slug" name="slug" value={form.slug} required onChange={setF} placeholder="judul-artikel" />
                        <AdminInput label="Baca (menit)" name="read_minutes" type="number" value={form.read_minutes} onChange={setF} min={1} />
                        <AdminInput label="Phase" name="phase" type="select" value={form.phase} onChange={setF}>
                            <option value="">-- Pilih Phase --</option>
                            {PHASE.map(p => <option key={p} value={p}>{p}</option>)}
                        </AdminInput>
                        <div className="isx-admincontent-16">
                            <AdminInput label="Ringkasan" name="ringkasan" type="textarea" value={form.ringkasan} onChange={setF} placeholder="Ringkasan singkat artikel" />
                        </div>
                        <div className="isx-admincontent-17">
                            <AdminInput label="Isi Artikel (HTML diperbolehkan)" name="isi" type="textarea" value={form.isi} onChange={setF} placeholder="<p>Konten artikel...</p>" className="isx-admincontent-18" />
                        </div>
                        <AdminInput label="Tags" name="tags" value={form.tags} onChange={setF} placeholder="tag1 tag2 tag3" />
                        <AdminInput label="URL Gambar" name="gambar_url" value={form.gambar_url} onChange={setF} placeholder="https://..." />
                    </div>
                    <label className="isx-admincontent-19">
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan artikel ini
                    </label>
                    <div className="isx-admincontent-20">
                        <button type="button" onClick={closeModal} className="isx-admincontent-21">Batal</button>
                        <button type="submit" disabled={saving} className="isx-admincontent-22">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Artikel" width={400}>
                <div className="isx-admincontent-23">
                    <p className="isx-admincontent-24">Hapus artikel <strong>{selected?.judul || selected?.title}</strong>?</p>
                    <div className="isx-admincontent-25">
                        <button onClick={closeModal} className="isx-admincontent-26">Batal</button>
                        <button onClick={handleDelete} disabled={saving} className="isx-admincontent-27">{saving ? 'Menghapus...' : 'Hapus'}</button>
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
  background: 'linear-gradient(135deg, #E8307D, #f472b6)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};
const btnE = {
  padding: '0.4rem',
  background: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#0ea5e9',
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