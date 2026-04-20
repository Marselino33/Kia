import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, ChefHat } from 'lucide-react';
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-resep.css';
const EMPTY = {
  nama: '',
  slug: '',
  deskripsi: '',
  kategori: '',
  usia_kategori: '',
  durasi_menit: 30,
  kalori: 0,
  bahan: '',
  langkah: '',
  nutrisi: '',
  gambar_url: '',
  is_published: true
};
const KATEGORI = ['MPASI', 'Ibu Hamil', 'Ibu Menyusui', 'Balita', 'Keluarga'];
export default function AdminResep() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const fetchData = () => {
    setLoading(true);
    adminApi.get('/admin/resep-gizi').then(r => setList(r.data?.data || [])).catch(() => toast.error('Gagal memuat resep')).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openCreate = () => {
    setForm(EMPTY);
    setSelected(null);
    setModal('create');
  };
  const openEdit = item => {
    setForm({
      nama: item.nama,
      slug: item.slug,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori || '',
      usia_kategori: item.usia_kategori || '',
      durasi_menit: item.durasi_menit || 30,
      kalori: item.kalori || 0,
      bahan: item.bahan || '',
      langkah: item.langkah || '',
      nutrisi: item.nutrisi || '',
      gambar_url: item.gambar_url || '',
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
  const autoSlug = n => n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const handleSave = async e => {
    e.preventDefault();
    if (!form.nama || !form.slug) {
      toast.error('Nama dan slug wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        durasi_menit: parseInt(form.durasi_menit) || 0,
        kalori: parseInt(form.kalori) || 0
      };
      if (modal === 'create') {
        await adminApi.post('/admin/resep-gizi', payload);
        toast.success('Resep berhasil ditambahkan');
      } else {
        await adminApi.put(`/admin/resep-gizi/${selected.id}`, payload);
        toast.success('Resep berhasil diperbarui');
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
      await adminApi.delete(`/admin/resep-gizi/${selected.id}`);
      toast.success('Resep berhasil dihapus');
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };
  const filtered = list.filter(r => r.nama?.toLowerCase().includes(search.toLowerCase()));
  return <AdminLayout>
            <AdminPageHeader title="Manajemen Resep Gizi" subtitle={`${list.length} resep`} action={<button onClick={openCreate} className="isx-adminresep-1"><Plus size={16} /> Tambah Resep</button>} />
            <div className="isx-adminresep-2">
                <AdminCard>
                    <div className="isx-adminresep-3">
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari nama resep..." value={search} onChange={e => setSearch(e.target.value)} className="isx-adminresep-4" />
                    </div>
                    <div className="isx-adminresep-5">
                        {loading ? <div className="isx-adminresep-6">Memuat...</div> : filtered.length === 0 ? <div className="isx-adminresep-7"><ChefHat size={32} /><p>Tidak ada resep</p></div> : <table className="admin-table">
                                    <thead><tr>
                                <th className="admin-th">Nama Resep</th>
                                <th className="admin-th">Kategori</th>
                                <th className="admin-th">Usia</th>
                                <th className="admin-th">Durasi</th>
                                <th className="admin-th">Kalori</th>
                                <th className="admin-th">Status</th>
                                <th className="admin-th admin-th-right">Aksi</th>
                                    </tr></thead>
                                    <tbody>
                                        {filtered.map(r => <tr key={r.id}>
                                    <td className="admin-td"><strong>{r.nama}</strong></td>
                                    <td className="admin-td">{r.kategori || '-'}</td>
                                    <td className="admin-td">{r.usia_kategori || '-'}</td>
                                    <td className="admin-td">{r.durasi_menit} menit</td>
                                    <td className="admin-td">{r.kalori} kkal</td>
                                    <td className="admin-td">
                                      <span className={r.is_published !== false ? 'admin-status-pill admin-status-pill-published' : 'admin-status-pill admin-status-pill-draft'}>
                                                        {r.is_published !== false ? 'Publik' : 'Draft'}
                                                    </span>
                                                </td>
                                    <td className="admin-td admin-td-right">
                                                    <div className="isx-adminresep-8">
                                                        <button onClick={() => openEdit(r)} className="isx-adminresep-9"><Pencil size={14} /></button>
                                                        <button onClick={() => openDelete(r)} className="isx-adminresep-10"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>)}
                                    </tbody>
                                </table>}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Resep' : 'Edit Resep'} width={640}>
                <form onSubmit={handleSave} className="isx-adminresep-11">
                    <div className="isx-adminresep-12">
                        <div className="isx-adminresep-13">
                            <AdminInput label="Nama Resep" name="nama" value={form.nama} required onChange={e => {
              setF(e);
              if (!selected) setForm(p => ({
                ...p,
                slug: autoSlug(e.target.value)
              }));
            }} placeholder="Nama resep" />
                        </div>
                        <AdminInput label="Slug" name="slug" value={form.slug} required onChange={setF} placeholder="nama-resep" />
                        <AdminInput label="Kategori" name="kategori" type="select" value={form.kategori} onChange={setF}>
                            <option value="">-- Pilih --</option>
                            {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                        </AdminInput>
                        <AdminInput label="Usia Kategori" name="usia_kategori" value={form.usia_kategori} onChange={setF} placeholder="Contoh: 6-8 bulan" />
                        <AdminInput label="Durasi (menit)" name="durasi_menit" type="number" value={form.durasi_menit} onChange={setF} min={0} />
                        <AdminInput label="Kalori (kkal)" name="kalori" type="number" value={form.kalori} onChange={setF} min={0} />
                        <div className="isx-adminresep-14">
                            <AdminInput label="Deskripsi" name="deskripsi" type="textarea" value={form.deskripsi} onChange={setF} placeholder="Deskripsi singkat resep" />
                        </div>
                        <div className="isx-adminresep-15">
                            <AdminInput label="Bahan-bahan" name="bahan" type="textarea" value={form.bahan} onChange={setF} placeholder="Daftar bahan..." />
                        </div>
                        <div className="isx-adminresep-16">
                            <AdminInput label="Langkah Pembuatan" name="langkah" type="textarea" value={form.langkah} onChange={setF} placeholder="1. Langkah pertama..." />
                        </div>
                        <AdminInput label="Info Nutrisi" name="nutrisi" value={form.nutrisi} onChange={setF} placeholder="Protein: 10g..." />
                        <AdminInput label="URL Gambar" name="gambar_url" value={form.gambar_url} onChange={setF} placeholder="https://..." />
                    </div>
                    <label className="isx-adminresep-17">
                        <input type="checkbox" name="is_published" checked={form.is_published} onChange={setF} />
                        Publikasikan resep ini
                    </label>
                    <div className="isx-adminresep-18">
                        <button type="button" onClick={closeModal} className="isx-adminresep-19">Batal</button>
                        <button type="submit" disabled={saving} className="isx-adminresep-20">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Resep" width={400}>
                <div className="isx-adminresep-21">
                    <p className="isx-adminresep-22">Hapus resep <strong>{selected?.nama}</strong>?</p>
                    <div className="isx-adminresep-23">
                        <button onClick={closeModal} className="isx-adminresep-24">Batal</button>
                        <button onClick={handleDelete} disabled={saving} className="isx-adminresep-25">{saving ? 'Menghapus...' : 'Hapus'}</button>
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