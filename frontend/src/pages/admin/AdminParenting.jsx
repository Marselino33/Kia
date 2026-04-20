import { useEffect, useMemo, useState } from 'react'
import {
  BadgePlus,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Search,
  Trash2,
  Video,
  Newspaper,
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import adminApi from '../../lib/adminApi'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-admin-parenting.css'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=960&q=80'

const CATEGORY_OPTIONS = ['Motorik', 'Sensorik', 'Kognitif', 'Visual', 'Sosial Emosional', 'Pola Asuh']
const AGE_OPTIONS = ['0-3 Bulan', '3-6 Bulan', '6-9 Bulan', '9-12 Bulan', '12-24 Bulan', '2-3 Tahun']

const EMPTY_FORM = {
  type: 'artikel',
  judul: '',
  slug: '',
  kategori: 'Motorik',
  read_minutes: 15,
  thumbnail: '',
  video_url: '',
  ageRanges: ['3-6 Bulan'],
  langkah: '',
  manfaat: '',
  peralatan: '',
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

function buildIsiFromSections(form) {
  const sections = [
    '## Langkah-Langkah',
    form.langkah || '-',
    '',
    '## Manfaat',
    form.manfaat || '-',
    '',
    '## Peralatan',
    form.peralatan || '-',
  ]

  if (form.video_url) {
    sections.push('', '## Video', form.video_url)
  }

  return sections.join('\n')
}

function extractSection(content, section) {
  if (!content) return ''
  const pattern = new RegExp(`## ${section}\\n([\\s\\S]*?)(?:\\n## |$)`, 'i')
  const match = content.match(pattern)
  return match ? match[1].trim() : ''
}

function parseAgeRanges(item) {
  const tags = item.tags || ''
  if (tags.startsWith('ages:')) {
    return tags.replace('ages:', '').split('|').map((x) => x.trim()).filter(Boolean)
  }
  if (item.phase) return [item.phase]
  return ['3-6 Bulan']
}

function mapItemToForm(item) {
  return {
    type: item.tags?.includes('type:video') ? 'video' : 'artikel',
    judul: item.judul || '',
    slug: item.slug || '',
    kategori: item.kategori || 'Motorik',
    read_minutes: item.read_minutes || 15,
    thumbnail: item.gambar_url || '',
    video_url: extractSection(item.isi, 'Video'),
    ageRanges: parseAgeRanges(item),
    langkah: extractSection(item.isi, 'Langkah-Langkah'),
    manfaat: extractSection(item.isi, 'Manfaat'),
    peralatan: extractSection(item.isi, 'Peralatan'),
    is_published: item.is_published !== false,
  }
}

export default function AdminParenting() {
  const [mode, setMode] = useState('list')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const pageSize = 10

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await adminApi.get('/admin/content?feature=stimulus_anak&page=1&limit=200')
      setItems(Array.isArray(res?.data?.data) ? res.data.data : [])
    } catch {
      toast.error('Gagal memuat data stimulus')
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
      data = data.filter((item) => (item.judul || '').toLowerCase().includes(term))
    }

    if (phaseFilter !== 'all') {
      data = data.filter((item) => {
        const ages = parseAgeRanges(item)
        return ages.includes(phaseFilter)
      })
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) =>
        statusFilter === 'published' ? item.is_published !== false : item.is_published === false
      )
    }

    return data
  }, [items, search, phaseFilter, statusFilter])

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
    if (!window.confirm(`Hapus aktivitas "${item.judul}"?`)) return
    try {
      await adminApi.delete(`/admin/content/${item.id}?feature=stimulus_anak`)
      toast.success('Aktivitas berhasil dihapus')
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus aktivitas')
    }
  }

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleAge = (label) => {
    setForm((prev) => {
      const exists = prev.ageRanges.includes(label)
      const ageRanges = exists
        ? prev.ageRanges.filter((item) => item !== label)
        : [...prev.ageRanges, label]
      return { ...prev, ageRanges: ageRanges.length ? ageRanges : [label] }
    })
  }

  const submitForm = async (publishValue) => {
    if (!form.judul.trim()) {
      toast.error('Judul aktivitas wajib diisi')
      return
    }

    const generatedSlug = form.slug.trim() || slugify(form.judul)
    const ageRanges = form.ageRanges.length ? form.ageRanges : ['3-6 Bulan']

    const payload = {
      slug: generatedSlug,
      judul: form.judul,
      kategori: form.kategori,
      phase: ageRanges[0],
      tags: `ages:${ageRanges.join('|')}|type:${form.type}`,
      ringkasan: (form.manfaat || form.langkah || '').split('\n')[0]?.slice(0, 180) || 'Aktivitas stimulus anak',
      isi: buildIsiFromSections(form),
      gambar_url: form.thumbnail || DEFAULT_IMAGE,
      read_minutes: Number(form.read_minutes) || 15,
      is_published: publishValue,
    }

    try {
      setSaving(true)
      if (mode === 'edit' && editingItem?.id) {
        await adminApi.put(`/admin/content/${editingItem.id}?feature=stimulus_anak`, payload)
        toast.success('Perubahan stimulus disimpan')
      } else {
        await adminApi.post('/admin/content?feature=stimulus_anak', payload)
        toast.success(publishValue ? 'Stimulus berhasil diterbitkan' : 'Stimulus disimpan sebagai draft')
      }
      cancelForm()
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan stimulus')
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
              <h1>Daftar Aktivitas Stimulus</h1>
              <p>Kelola materi edukasi stimulus motorik dan kognitif anak.</p>
            </div>
            <button className="parenting-admin-primary-btn" onClick={startCreate}>
              <BadgePlus size={17} /> Tambah Stimulus
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
                  placeholder="Cari judul aktivitas..."
                />
              </label>

              <select
                value={phaseFilter}
                onChange={(e) => {
                  setPhaseFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Semua Fase Usia</option>
                {AGE_OPTIONS.map((item) => (
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
                Menampilkan {filtered.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)} dari {filtered.length} aktivitas
              </p>
            </div>

            <div className="parenting-admin-table-scroll">
              <table className="parenting-admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Judul Aktivitas</th>
                    <th>Kategori</th>
                    <th>Filter Usia</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">Memuat data...</td></tr>
                  ) : paged.length === 0 ? (
                    <tr><td colSpan={6} className="parenting-admin-empty">Belum ada data stimulus.</td></tr>
                  ) : (
                    paged.map((item) => {
                      const ages = parseAgeRanges(item)
                      return (
                        <tr key={item.id}>
                          <td>
                            <img src={item.gambar_url || DEFAULT_IMAGE} alt={item.judul} className="parenting-admin-thumb" />
                          </td>
                          <td>
                            <strong>{item.judul}</strong>
                            <small>Diperbarui: {new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID')}</small>
                          </td>
                          <td>
                            <span className="parenting-admin-pill category">{item.kategori || 'Stimulus'}</span>
                          </td>
                          <td>
                            <span className="parenting-admin-pill age">{ages.join(', ')}</span>
                          </td>
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
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="parenting-admin-pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
              <span>{page}</span>
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
            <h1>{mode === 'edit' ? 'Edit Stimulus Anak' : 'Tambah Stimulus Baru'}</h1>
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
              <h3>Tipe Konten</h3>
              <div className="parenting-admin-type-switch">
                <button className={form.type === 'artikel' ? 'active' : ''} onClick={() => updateField('type', 'artikel')}>
                  <Newspaper size={15} /> Artikel
                </button>
                <button className={form.type === 'video' ? 'active' : ''} onClick={() => updateField('type', 'video')}>
                  <Video size={15} /> Video
                </button>
              </div>

              <label>Judul Aktivitas</label>
              <input
                value={form.judul}
                onChange={(e) => {
                  updateField('judul', e.target.value)
                  if (!editingItem) updateField('slug', slugify(e.target.value))
                }}
                placeholder="Contoh: Bermain cilukba untuk bayi"
              />

              <label>Slug</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="judul-aktivitas" />

              <div className="inline-two">
                <div>
                  <label>Label Kategori</label>
                  <select value={form.kategori} onChange={(e) => updateField('kategori', e.target.value)}>
                    {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label>Estimasi Waktu</label>
                  <div className="input-icon-wrap">
                    <Clock3 size={15} />
                    <input type="number" min={1} value={form.read_minutes} onChange={(e) => updateField('read_minutes', e.target.value)} />
                  </div>
                </div>
              </div>
            </article>

            <article className="parenting-admin-card">
              <h3>Langkah-langkah</h3>
              <textarea
                rows={8}
                value={form.langkah}
                onChange={(e) => updateField('langkah', e.target.value)}
                placeholder="Tuliskan panduan langkah demi langkah di sini..."
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Manfaat</h3>
              <textarea
                rows={6}
                value={form.manfaat}
                onChange={(e) => updateField('manfaat', e.target.value)}
                placeholder="Apa saja manfaat aktivitas ini bagi tumbuh kembang anak?"
              />
            </article>

            <article className="parenting-admin-card">
              <h3>Peralatan yang dibutuhkan</h3>
              <textarea
                rows={5}
                value={form.peralatan}
                onChange={(e) => updateField('peralatan', e.target.value)}
                placeholder="Daftar alat dan bahan yang diperlukan (opsional)..."
              />
            </article>
          </div>

          <aside className="parenting-admin-form-side">
            <article className="parenting-admin-card">
              <h3>Thumbnail Konten</h3>
              <div className="parenting-admin-preview-wrap">
                <img src={form.thumbnail || DEFAULT_IMAGE} alt="preview" />
              </div>
              <label>URL Thumbnail</label>
              <input
                value={form.thumbnail}
                onChange={(e) => updateField('thumbnail', e.target.value)}
                placeholder="https://..."
              />
              {form.type === 'video' && (
                <>
                  <label>Link Video Embed</label>
                  <input
                    value={form.video_url}
                    onChange={(e) => updateField('video_url', e.target.value)}
                    placeholder="https://youtube.com/embed/..."
                  />
                </>
              )}
            </article>

            <article className="parenting-admin-card">
              <h3>Rentang Usia</h3>
              <div className="parenting-admin-age-grid">
                {AGE_OPTIONS.map((item) => {
                  const checked = form.ageRanges.includes(item)
                  return (
                    <label key={item} className={checked ? 'checked' : ''}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAge(item)} />
                      <CalendarRange size={14} /> {item}
                    </label>
                  )
                })}
              </div>
            </article>

            <article className="parenting-admin-actions-card">
              <button className="publish" disabled={saving} onClick={() => submitForm(true)}>Terbitkan Aktivitas</button>
              <button className="draft" disabled={saving} onClick={() => submitForm(false)}>Simpan sebagai Draft</button>
              <button className="cancel" onClick={cancelForm}>Batalkan Pengisian</button>
            </article>
          </aside>
        </section>
      </div>
    </AdminLayout>
  )
}
