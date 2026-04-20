import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Baby } from 'lucide-react';
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-anak.css';
const EMPTY = {
  nama: '',
  tanggal_lahir: '',
  jenis_kelamin: 'laki-laki',
  pengguna_id: ''
};
export default function AdminAnak() {
  const [list, setList] = useState([]);
  const [penggunaList, setPenggunaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const fetchData = () => {
    setLoading(true);
    Promise.all([adminApi.get('/admin/anak'), adminApi.get('/admin/pengguna')]).then(([anakResp, penggunaResp]) => {
      setList(anakResp.data?.data || []);
      setPenggunaList(penggunaResp.data?.data || []);
    }).catch(() => toast.error('Gagal memuat data admin')).finally(() => setLoading(false));
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
      tanggal_lahir: item.tanggal_lahir?.split('T')[0] || '',
      jenis_kelamin: normalizeJenisKelamin(item.jenis_kelamin),
      pengguna_id: item.pengguna_id || ''
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
  const setF = e => setForm(p => ({
    ...p,
    [e.target.name]: e.target.value
  }));
  const handleSave = async e => {
    e.preventDefault();
    if (!form.nama || !form.tanggal_lahir || !form.jenis_kelamin) {
      toast.error('Nama, tanggal lahir, dan jenis kelamin wajib diisi');
      return;
    }
    if (modal === 'create' && !form.pengguna_id) {
      toast.error('Pengguna wajib dipilih untuk data anak baru');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: normalizeJenisKelamin(form.jenis_kelamin)
      };
      if (modal === 'create') {
        await adminApi.post(`/admin/anak?pengguna_id=${encodeURIComponent(form.pengguna_id)}`, payload);
        toast.success('Data anak berhasil ditambahkan');
      } else {
        await adminApi.put(`/admin/anak/${selected.id}`, payload);
        toast.success('Data anak berhasil diperbarui');
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
      await adminApi.delete(`/admin/anak/${selected.id}`);
      toast.success('Data anak berhasil dihapus');
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };
  const filtered = list.filter(a => a.nama?.toLowerCase().includes(search.toLowerCase()));
  return <AdminLayout>
            <AdminPageHeader title="Data Anak" subtitle={`${list.length} data anak`} action={<button onClick={openCreate} className="isx-adminanak-1"><Plus size={16} /> Tambah Anak</button>} />
            <div className="isx-adminanak-2">
                <AdminCard>
                    <div className="isx-adminanak-3">
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari nama anak..." value={search} onChange={e => setSearch(e.target.value)} className="isx-adminanak-4" />
                    </div>
                    <div className="isx-adminanak-5">
                        {loading ? <div className="isx-adminanak-6">Memuat...</div> : filtered.length === 0 ? <div className="isx-adminanak-7"><Baby size={32} /><p>Tidak ada data</p></div> : <table className="admin-table">
                                        <thead><tr>
                                            <th className="admin-th">Nama</th>
                                            <th className="admin-th">Tanggal Lahir</th>
                                            <th className="admin-th">Jenis Kelamin</th>
                                            <th className="admin-th">Pengguna ID</th>
                                            <th className="admin-th admin-th-right">Aksi</th>
                                        </tr></thead>
                                        <tbody>
                                            {filtered.map(a => <tr key={a.id}>
                                                    <td className="admin-td"><strong>{a.nama}</strong></td>
                                                    <td className="admin-td">{a.tanggal_lahir?.split('T')[0] || '-'}</td>
                                                    <td className="admin-td">{formatJenisKelamin(a.jenis_kelamin)}</td>
                                                    <td className="admin-td admin-td-subtle">{a.pengguna_id || '-'}</td>
                                                    <td className="admin-td admin-td-right">
                                                        <div className="isx-adminanak-8">
                                                            <button onClick={() => openEdit(a)} className="isx-adminanak-9"><Pencil size={14} /></button>
                                                            <button onClick={() => openDelete(a)} className="isx-adminanak-10"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>)}
                                        </tbody>
                                    </table>}
                    </div>
                </AdminCard>
            </div>

            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Data Anak' : 'Edit Data Anak'}>
                <form onSubmit={handleSave} className="isx-adminanak-11">
                    <AdminInput label="Nama Anak" name="nama" value={form.nama} onChange={setF} required placeholder="Nama lengkap anak" />
                    <AdminInput label="Tanggal Lahir" name="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={setF} required />
                    <AdminInput label="Jenis Kelamin" name="jenis_kelamin" type="select" value={form.jenis_kelamin} onChange={setF}>
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </AdminInput>
                    <AdminInput label="Pengguna" name="pengguna_id" type="select" value={form.pengguna_id} onChange={setF} required={modal === 'create'}>
                      <option value="">-- Pilih Pengguna --</option>
                      {penggunaList.map(p => <option key={p.id} value={p.id}>{p.nama} ({p.email || '-'})</option>)}
                    </AdminInput>
                    <div className="isx-adminanak-12">
                        <button type="button" onClick={closeModal} className="isx-adminanak-13">Batal</button>
                        <button type="submit" disabled={saving} className="isx-adminanak-14">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Data Anak" width={400}>
                <div className="isx-adminanak-15">
                    <p className="isx-adminanak-16">Hapus data anak <strong>{selected?.nama}</strong>?</p>
                    <div className="isx-adminanak-17">
                        <button onClick={closeModal} className="isx-adminanak-18">Batal</button>
                        <button onClick={handleDelete} disabled={saving} className="isx-adminanak-19">{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>;
}
function normalizeJenisKelamin(value) {
  const val = (value || '').toLowerCase();
  if (val === 'l' || val === 'laki-laki') return 'laki-laki';
  if (val === 'p' || val === 'perempuan') return 'perempuan';
  return 'laki-laki';
}
function formatJenisKelamin(value) {
  return normalizeJenisKelamin(value) === 'laki-laki' ? 'Laki-laki' : 'Perempuan';
}
const btnPrimary = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.6rem 1.25rem',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};
const btnEdit = {
  padding: '0.4rem',
  background: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#0ea5e9',
  display: 'flex'
};
const btnDel = {
  padding: '0.4rem',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#ef4444',
  display: 'flex'
};
const btnCancel = {
  padding: '0.6rem 1.25rem',
  background: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: '#374151'
};
const btnDanger = {
  padding: '0.6rem 1.25rem',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};