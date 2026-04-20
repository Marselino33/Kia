import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import AdminLayout, { AdminPageHeader, AdminCard, AdminModal, AdminInput, tableStyle, thStyle, tdStyle } from './AdminLayout';
import adminApi from '../../lib/adminApi';
import toast from 'react-hot-toast';
import '../../styles/pages/admin-admin-pengguna.css';
const EMPTY_FORM = {
  nama: '',
  email: '',
  password: '',
  role: 'user',
  desa: ''
};
const ROLES = ['user', 'admin'];
export default function AdminPengguna() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const fetchData = () => {
    setLoading(true);
    adminApi.get('/admin/pengguna').then(r => setList(r.data?.data || [])).catch(() => toast.error('Gagal memuat data pengguna')).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal('create');
  };
  const openEdit = item => {
    setForm({
      nama: item.nama,
      email: item.email || '',
      password: '',
      role: item.role || 'user',
      desa: item.desa || ''
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
  const handleSetForm = e => setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
  const handleSave = async e => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.role) {
      toast.error('Nama, Email, dan Role wajib diisi');
      return;
    }
    if (modal === 'create' && !form.password) {
      toast.error('Password wajib diisi untuk pengguna baru');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'create') {
        await adminApi.post('/admin/pengguna', form);
        toast.success('Pengguna berhasil ditambahkan');
      } else {
        const payload = {
          nama: form.nama,
          email: form.email,
          role: form.role,
          desa: form.desa
        };
        if (form.password) payload.password = form.password;
        await adminApi.put(`/admin/pengguna/${selected.id}`, payload);
        toast.success('Pengguna berhasil diperbarui');
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
      await adminApi.delete(`/admin/pengguna/${selected.id}`);
      toast.success('Pengguna berhasil dihapus');
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };
  const filtered = list.filter(u => u.nama?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  return <AdminLayout>
            <AdminPageHeader title="Manajemen Pengguna & Role" subtitle={`${list.length} pengguna terdaftar`} action={<button onClick={openCreate} className="isx-adminpengguna-1">
                        <Plus size={16} /> Tambah Pengguna
                    </button>} />
            <div className="isx-adminpengguna-2">
                <AdminCard>
                    {/* Search */}
                    <div className="isx-adminpengguna-3">
                        <Search size={16} color="#94a3b8" />
                        <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} className="isx-adminpengguna-4" />
                    </div>

                    {/* Table */}
                    <div className="isx-adminpengguna-5">
                        {loading ? <div className="isx-adminpengguna-6">Memuat...</div> : filtered.length === 0 ? <div className="isx-adminpengguna-7">
                                <Users size={32} className="isx-adminpengguna-8" />
                                <p>Tidak ada data</p>
                            </div> : <table className="admin-table">
                                <thead>
                                    <tr>
                                  <th className="admin-th">Nama</th>
                                  <th className="admin-th">Email</th>
                                  <th className="admin-th">Role</th>
                                  <th className="admin-th">Desa</th>
                                  <th className="admin-th admin-th-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(u => <tr key={u.id} className="isx-adminpengguna-9">
                                    <td className="admin-td"><strong>{u.nama}</strong></td>
                                    <td className="admin-td">{u.email || '-'}</td>
                                    <td className="admin-td">
                                      <span className={roleBadgeClass(u.role)}>{u.role}</span>
                                            </td>
                                    <td className="admin-td">{u.desa || '-'}</td>
                                    <td className="admin-td admin-td-right">
                                                <div className="isx-adminpengguna-10">
                                                    <button onClick={() => openEdit(u)} className="isx-adminpengguna-11"><Pencil size={14} /></button>
                                                    <button onClick={() => openDelete(u)} className="isx-adminpengguna-12"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>)}
                                </tbody>
                            </table>}
                    </div>
                </AdminCard>
            </div>

            {/* Create/Edit Modal */}
            <AdminModal open={modal === 'create' || modal === 'edit'} onClose={closeModal} title={modal === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}>
                <form onSubmit={handleSave} className="isx-adminpengguna-13">
                    <AdminInput label="Nama Lengkap" name="nama" value={form.nama} onChange={handleSetForm} required placeholder="Nama pengguna" />
                    <AdminInput label="Email" name="email" value={form.email} onChange={handleSetForm} required placeholder="nama@email.com" />
                    <AdminInput label={modal === 'create' ? 'Password' : 'Password Baru (kosongkan jika tidak diubah)'} name="password" type="password" value={form.password} onChange={handleSetForm} required={modal === 'create'} placeholder="Masukkan password" />
                    <AdminInput label="Role" name="role" type="select" value={form.role} onChange={handleSetForm} required>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </AdminInput>
                    <AdminInput label="Desa" name="desa" value={form.desa} onChange={handleSetForm} placeholder="Nama desa (opsional)" />
                    <div className="isx-adminpengguna-14">
                        <button type="button" onClick={closeModal} className="isx-adminpengguna-15">Batal</button>
                        <button type="submit" disabled={saving} className="isx-adminpengguna-16">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Modal */}
            <AdminModal open={modal === 'delete'} onClose={closeModal} title="Hapus Pengguna" width={400}>
                <div className="isx-adminpengguna-17">
                    <p className="isx-adminpengguna-18">
                        Apakah Anda yakin ingin menghapus pengguna <strong>{selected?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="isx-adminpengguna-19">
                        <button onClick={closeModal} className="isx-adminpengguna-20">Batal</button>
                        <button onClick={handleDelete} disabled={saving} className="isx-adminpengguna-21">{saving ? 'Menghapus...' : 'Hapus'}</button>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>;
}
function roleBadgeClass(role) {
  if (role === 'admin') return 'admin-role-badge admin-role-badge-admin';
  if (role === 'kader') return 'admin-role-badge admin-role-badge-kader';
  return 'admin-role-badge admin-role-badge-user';
}
const btnPrimaryStyle = {
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
const btnEditStyle = {
  padding: '0.4rem',
  background: '#e3f2fd',
  border: '1px solid #bbdefb',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#1565C0',
  display: 'flex'
};
const btnDeleteStyle = {
  padding: '0.4rem',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: '#ef4444',
  display: 'flex'
};
const btnCancelStyle = {
  padding: '0.6rem 1.25rem',
  background: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: '#374151'
};
const btnDangerStyle = {
  padding: '0.6rem 1.25rem',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 600
};