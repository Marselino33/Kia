import { useState, useEffect } from 'react';
import { Bookmark, BookmarkX, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import '../styles/pages/bookmarks.css';
const sampleBookmarks = [{
  id: 1,
  article: {
    id: 1,
    slug: 'nutrisi-ibu-hamil',
    title: 'Nutrisi Penting untuk Ibu Hamil',
    category: 'Gizi',
    readMinutes: 5
  },
  createdAt: '2025-01-15'
}, {
  id: 2,
  article: {
    id: 2,
    slug: 'imunisasi-dasar-bayi',
    title: 'Jadwal Imunisasi Dasar Bayi',
    category: 'Imunisasi',
    readMinutes: 7
  },
  createdAt: '2025-01-20'
}];
export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(sampleBookmarks);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api.get('/bookmarks').then(r => {
      if (r.data?.data?.length) setBookmarks(r.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const remove = async bm => {
    try {
      await api.delete(`/bookmarks/${bm.article?.id || bm.id}`);
    } catch {}
    setBookmarks(prev => prev.filter(b => b.id !== bm.id));
    toast.success('Bookmark dihapus');
  };
  return <div className="isx-bookmarks-1">
            <div className="isx-bookmarks-2">
                <div className="container">
                    <h1 className="isx-bookmarks-3">
                        <Bookmark size={22} className="isx-bookmarks-4" />
                        Artikel Tersimpan
                    </h1>
                    <p className="isx-bookmarks-5">{bookmarks.length} artikel disimpan</p>
                </div>
            </div>

            <div className="container isx-bookmarks-6">
                {loading ? <div className="isx-bookmarks-7">
                        {[1, 2, 3].map(i => <div key={i} className="glass-card skeleton isx-bookmarks-8" />)}
                    </div> : bookmarks.length === 0 ? <div className="isx-bookmarks-9">
                        <Bookmark size={48} className="isx-bookmarks-10" />
                        <p className="isx-bookmarks-11">Belum ada artikel tersimpan</p>
                        <p className="isx-bookmarks-12">Simpan artikel favorit Anda untuk dibaca nanti</p>
                        <Link to="/konten" className="btn btn-primary"><BookOpen size={15} /> Jelajahi Artikel</Link>
                    </div> : <div className="isx-bookmarks-13">
                        {bookmarks.map(bm => {
          const article = bm.article || bm;
          return <div key={bm.id} className="glass-card isx-bookmarks-14">
                                    <div className="isx-bookmarks-15">
                                        <BookOpen size={18} color="#ec4899" />
                                    </div>
                                    <div className="isx-bookmarks-16">
                                        <div className="isx-bookmarks-17">
                                            <span className="badge badge-pink isx-bookmarks-18">{article.category || 'Artikel'}</span>
                                        </div>
                                        <h3 className="isx-bookmarks-19">{article.title}</h3>
                                        <div className="isx-bookmarks-20">
                                            <span className="isx-bookmarks-21"><Clock size={11} /> {article.readMinutes || '5'} menit baca</span>
                                            {bm.createdAt && <span>Disimpan {bm.createdAt}</span>}
                                        </div>
                                    </div>
                                    <div className="isx-bookmarks-22">
                                        <Link to={`/konten/${article.slug || '#'}`} className="btn btn-ghost isx-bookmarks-23"><ExternalLink size={15} /></Link>
                                        <button onClick={() => remove(bm)} className="btn btn-ghost isx-bookmarks-24"><BookmarkX size={15} /></button>
                                    </div>
                                </div>;
        })}
                    </div>}
            </div>
        </div>;
}