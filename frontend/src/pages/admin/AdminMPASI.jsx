import { useEffect, useMemo, useState } from 'react'
import {
  BadgePlus,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Search,
  Trash2,
  FileText,
  ChefHat,
  Timer,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-parenting.css'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=960&q=80'

const KATEGORI_OPTIONS = [
  'Sarapan',
  'Makan Siang',
  'Makan Malam',
  'Camilan',
]

const USIA_OPTIONS = [
  'Ibu Hamil',
  'Bayi 0-6 Bulan',
  'MPASI 6-8 Bulan',
  'MPASI 8-10 Bulan',
  'MPASI 10-12 Bulan',
  'Balita 1-2 Tahun',
  'Balita 2-5 Tahun',
  'Ibu Menyusui',
]

const EMPTY_FORM = {
  nama: '',
  slug: '',
  deskripsi: '',
  kategori: 'MPASI',
  usia_kategori: 'MPASI 6-8 Bulan',
  durasi_menit: 30,
  kalori: 0,
  bahan: '',
  langkah: '',
  nutrisi: '',
  gambar_url: '',
  is_published: true,
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function mapItemToForm(item) {
  return {
    nama: item.nama || '',
    slug: item.slug || '',
    deskripsi: item.deskripsi || '',
    kategori: item.kategori || 'MPASI',
    usia_kategori: item.usia_kategori || 'MPASI 6-8 Bulan',
    durasi_menit: item.durasi_menit || 30,
    kalori: item.kalori || 0,
    bahan: item.bahan || '',
    langkah: item.langkah || '',
    nutrisi: item.nutrisi || '',
    gambar_url: item.gambar_url || '',
    is_published: item.is_published !== false,
  }
}

export default function AdminMPASI() {
  const [mode, setMode] = useState('list')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const pageSize = 10

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await adminApi.get('/admin/resep-gizi')
      setItems(Array.isArray(res?.data?.data) ? res.data.data : [])
    } catch {
      toast.error('Gagal memuat data MPASI')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filtered = useMemo(() => {
    let data = items

    if (search.trim()) {
      const term = search.toLowerCase()
      data = data.filter((item) => (item.nama || '').toLowerCase().includes(term))
    }

    if (kategoriFilter !== 'all') {
      data = data.filter((item) => item.kategori === kategoriFilter)
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) =>
        statusFilter === 'published' ? item.is_published !== false : item.is_published === false
      )
    }

    return data
  }, [items, search, kategoriFilter, statusFilter])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const startCreate = () => {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setMode('create')
  }

  const startEdit = (item) => {
    setEditingItem(item)
    setForm(mapItemToForm(item))
    setMode('edit')
  }

  const cancelForm = () => {
    setMode('list')
    setEditingItem(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus resep "${item.nama}"?`)) return
    try {
      await adminApi.delete(`/admin/resep-gizi/${item.id}`)
      toast.success('Resep berhasil dihapus')
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus resep')
    }
  }

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitForm = async (publishValue) => {
    if (!form.nama.trim()) {
      toast.error('Nama resep wajib diisi')
      return
    }

    const generatedSlug = form.slug.trim() || slugify(form.nama)

    const payload = {
      slug: generatedSlug,
      nama: form.nama,
      kategori: form.kategori,
      usia_kategori: form.usia_kategori,
      durasi_menit: Number(form.durasi_menit) || 30,
      kalori: Number(form.kalori) || 0,
      deskripsi: form.deskripsi,
      bahan: form.bahan,
      langkah: form.langkah,
      nutrisi: form.nutrisi,
      gambar_url: form.gambar_url || DEFAULT_IMAGE,
      is_published: publishValue,
    }

    try {
      setSaving(true)
      if (mode === 'edit' && editingItem?.id) {
        await adminApi.put(`/admin/resep-gizi/${editingItem.id}`, payload)
        toast.success('Perubahan disimpan')
      } else {
        await adminApi.post('/admin/resep-gizi', payload)
        toast.success(publishValue ? 'Resep berhasil diterbitkan' : 'Resep disimpan sebagai draft')
      }
      cancelForm()
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan resep')
    } finally {
      setSaving(false)
    }
  }

  if (mode === 'list') {
    return (
      <AdminLayout>
        <div className="parenting-admin-page">
          <section className="parenting-admin-head">
            <div>
              <h1>Manajemen Resep MPASI</h1>
              <p>Kelola resep MPASI dan makanan bergizi untuk anak.</p>
            </div>
            <button className="parenting-admin-primary-btn" onClick={startCreate}>
              <BadgePlus size={17} /> Tambah Resep
            </button>
          </section>

          <section className="parenting-admin-table-wrap">
            <div className="parenting-admin-table-toolbar">
              <label className="parenting-admin-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari nama resep..."
                />
              </label>

              <select
                value={kategoriFilter}
                onChange={(e) => {
                  setKategoriFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Semua Kategori</option>
                {KATEGORI_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Status</option>
                <option value="published">Terbit</option>
                <option value="draft">Draft</option>
              </select>

              <p>
                Menampilkan {filtered.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length} resep
              </p>
            </div>

            <div className="parenting-admin-table-scroll">
              <table className="parenting-admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Nama Resep</th>
                    <th>Kategori</th>
                    <th>Usia</th>
                    <th>Durasi</th>
                    <th>Kalori</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="parenting-admin-empty">Memuat data...</td></tr>
                  ) : paged.length === 0 ? (
                    <tr><td colSpan={8} className="parenting-admin-empty">
                      <ChefHat size={32} />
                      <p>Belum ada resep MPASI.</p>
                      <button onClick={startCreate} className="parenting-admin-primary-btn" style={{ marginTop: '1rem' }}>
                        <BadgePlus size={17} /> Tambah Resep Pertama
                      </button>
                    </td></tr>
                  ) : (
                    paged.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.gambar_url || DEFAULT_IMAGE} alt={item.nama} className="parenting-admin-thumb" />
                        </td>
                        <td>
                          <strong>{item.nama}</strong>
                          <small>{item.deskripsi?.slice(0, 60) || 'Tidak ada deskripsi'}...</small>
                        </td>
                        <td>
                          <span className="parenting-admin-pill category">{item.kategori || '-'}</span>
                        </td>
                        <td>
                          <span className="parenting-admin-pill age">{item.usia_kategori || '-'}</span>
                        </td>
                        <td>{item.durasi_menit} menit</td>
                        <td>{item.kalori} kkal</td>
                        <td>
                          <span className={`parenting-admin-status ${item.is_published !== false ? 'published' : 'draft'}`}>
                            {item.is_published !== false ? 'TERBIT' : 'DRAFT'}
                          </span>
                        </td>
                        <td>
                          <div className="parenting-admin-actions">
                            <button onClick={() => startEdit(item)}><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(item)} className="danger"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="parenting-admin-pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
              <span>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
            </div>
          </section>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="parenting-admin-page">
        <section className="parenting-admin-form-topbar">
          <div>
            <h1>{mode === 'edit' ? 'Edit Resep MPASI' : 'Tambah Resep MPASI'}</h1>
          </div>
          <div>
            <button className="ghost" onClick={cancelForm}>Batalkan</button>
            <button className="save" onClick={() => submitForm(form.is_published)} disabled={saving}>
              {mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </section>

        <section className="parenting-admin-form-grid">
          <div className="parenting-admin-form-main">
            <article className="parenting-admin-card">
              <h3><ChefHat size={16} /> Informasi Resep</h3>
              
              <label>Nama Resep</label>
              <input
                value={form.nama}
                onChange={(e) => {
                  updateField('nama', e.target.value)
                  if (!editingItem) updateField('slug', slugify(e.target.value))
                }}
                placeholder="Contoh: Puree Wortel MPASI 6 Bulan"
              />

              <label>Slug URL</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="puree-wortel-mpasi-6-bulan" />

              <div className="inline-two">
                <div>
                  <label>Kategori</label>
                  <select value={form.kategori} onChange={(e) => updateField('kategori', e.target.value)}>
                    {KATEGORI_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label>Usia Kategori</label>
                  <select value={form.usia_kategori} onChange={(e) => updateField('usia_kategori', e.target.value)}>
                    {USIA_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              <div className="inline-two">
                <div>
                  <label>Durasi (menit)</label>
                  <div className="input-icon-wrap">
                    <Timer size={15} />
                    <input type="number" min={1} value={form.durasi_menit} onChange={(e) => updateField('durasi_menit', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label>Kalori (kkal)</label>
                  <div className="input-icon-wrap">
                    <Clock3 size={15} />
                    <input type="number" min={0} value={form.kalori} onChange={(e) => updateField('kalori', e.target.value)} />
                  </div>
                </div>
              </div>
            </article>

            <article className="parenting-admin-card">
              <h3><FileText size={16} /> Deskripsi</h3>
              <textarea
                rows={3}
                value={form.deskripsi}
                onChange={(e) => updateField('deskripsi', e.target.value)}
                placeholder="Deskripsi singkat resep..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Bahan-bahan</h3>
              <textarea
                rows={6}
                value={form.bahan}
                onChange={(e) => updateField('bahan', e.target.value)}
                placeholder="- Wortel 50g&#10;- Kentang 30g&#10;- Daging ayam 20g&#10;..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Langkah Pembuatan</h3>
              <textarea
                rows={8}
                value={form.langkah}
                onChange={(e) => updateField('langkah', e.target.value)}
                placeholder="1. Cuci bersih semua bahan...&#10;2. Potong wortel...&#10;3. Kukus selama 15 menit..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Info Nutrisi</h3>
              <textarea
                rows={3}
                value={form.nutrisi}
                onChange={(e) => updateField('nutrisi', e.target.value)}
                placeholder="Protein: 10g&#10;Karbohidrat: 20g&#10;Serat: 5g"
              />
            </article>
          </div>

          <aside className="parenting-admin-form-side">
            <article className="parenting-admin-card">
              <h3>Thumbnail Resep</h3>
              <div className="parenting-admin-preview-wrap">
                <img src={form.gambar_url || DEFAULT_IMAGE} alt="preview" />
              </div>
              <label>URL Gambar</label>
              <input
                value={form.gambar_url}
                onChange={(e) => updateField('gambar_url', e.target.value)}
                placeholder="https://..."
              />
            </article>

            <article className="parenting-admin-actions-card">
              <button className="publish" disabled={saving} onClick={() => submitForm(true)}>
                {saving ? 'Menyimpan...' : 'Terbitkan Resep'}
              </button>
              <button className="draft" disabled={saving} onClick={() => submitForm(false)}>
                Simpan sebagai Draft
              </button>
              <button className="cancel" onClick={cancelForm}>
                Batalkan Pengisian
              </button>
            </article>
          </aside>
        </section>
      </div>
    </AdminLayout>
  )
}