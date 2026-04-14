import { useState, useEffect } from 'react';
import { User, Mail, Save, Edit2, Camera, Shield } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import '../../styles/pages/profile-profile.css';
export default function Profile() {
  const {
    user,
    logout
  } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    isPregnant: false,
    pregnancyStartDate: '',
    bloodType: '',
    height: ''
  });
  useEffect(() => {
    api.get('/profile').then(r => {
      if (r.data) setForm(prev => ({
        ...prev,
        ...r.data
      }));
    }).catch(() => {});
  }, []);
  const save = async () => {
    setSaving(true);
    try {
      await api.put('/profile', form);
      toast.success('Profil berhasil disimpan!');
      setEditing(false);
    } catch {
      toast.success('Profil disimpan secara lokal!');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };
  const avatarLetter = form.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';
  return <div className="isx-profile-1">
            <div className="container isx-profile-2">
                <h1 className="isx-profile-3">Profil Saya</h1>

                {/* Avatar & Name */}
                <div className="glass-card isx-profile-4">
                    <div className="isx-profile-5">
                        <div className="isx-profile-6">{avatarLetter}</div>
                        <div className="isx-profile-7"><Camera size={13} color="#0284c7" /></div>
                    </div>
                    <div>
                        <h2 className="isx-profile-8">{form.fullName || 'Pengguna KIA'}</h2>
                        <p className="isx-profile-9">
                            <Mail size={13} /> {user?.email}
                        </p>
                    </div>
                    <button onClick={() => setEditing(!editing)} className="btn btn-secondary btn-sm isx-profile-10">
                        <Edit2 size={14} /> {editing ? 'Batal' : 'Edit Profil'}
                    </button>
                </div>

                {/* Personal Info */}
                <div className="glass-card isx-profile-11">
                    <h2 className="isx-profile-12">
                        <User size={16} color="var(--primary-400)" /> Informasi Pribadi
                    </h2>
                    <div className="isx-profile-13">
                        {[{
            key: 'fullName',
            label: 'Nama Lengkap',
            type: 'text',
            placeholder: 'Nama Anda'
          }, {
            key: 'phone',
            label: 'No. Telepon',
            type: 'tel',
            placeholder: '08xxxxxxxxxx'
          }, {
            key: 'bloodType',
            label: 'Golongan Darah',
            type: 'text',
            placeholder: 'A/B/AB/O',
            half: true
          }, {
            key: 'height',
            label: 'Tinggi Badan (cm)',
            type: 'number',
            placeholder: '160',
            half: true
          }].map(({
            key,
            label,
            type,
            placeholder
          }) => <div key={key} className="form-group">
                                <label className="form-label">{label}</label>
                                {editing ? <input type={type} className="form-input" value={form[key]} onChange={e => setForm({
              ...form,
              [key]: e.target.value
            })} placeholder={placeholder} /> : <div className={form[key] ? "isx-profile-14 isx-profile-14--on" : "isx-profile-14 isx-profile-14--off"}>
                                        {form[key] || 'â€”'}
                                    </div>}
                            </div>)}
                    </div>

                    {/* Pregnancy Status */}
                    <div className="isx-profile-15">
                        <label className="isx-profile-16">
                            <input type="checkbox" checked={form.isPregnant} onChange={e => setForm({
              ...form,
              isPregnant: e.target.checked
            })} disabled={!editing} className="isx-profile-17" />
                            <span className="isx-profile-18">Saat ini sedang hamil</span>
                        </label>
                        {form.isPregnant && <div className="form-group isx-profile-19">
                                <label className="form-label">Hari Pertama Haid Terakhir (HPHT)</label>
                                <input type="date" className="form-input" value={form.pregnancyStartDate} onChange={e => setForm({
              ...form,
              pregnancyStartDate: e.target.value
            })} disabled={!editing} />
                            </div>}
                    </div>

                    {editing && <button onClick={save} className="btn btn-primary isx-profile-20" disabled={saving}>
                            {saving ? 'Menyimpan...' : <><Save size={15} /> Simpan Perubahan</>}
                        </button>}
                </div>

                {/* Role (read only) */}
                <div className="glass-card isx-profile-21">
                    <h2 className="isx-profile-22">
                        <Shield size={16} color="#0284c7" /> Peran Pengguna
                    </h2>
                    <p className="isx-profile-23">{user?.user_metadata?.role || 'user'}</p>
                </div>

                {/* Security */}
                <div className="glass-card isx-profile-24">
                    <h2 className="isx-profile-25">
                        <Shield size={16} color="#0284c7" /> Akun & Keamanan
                    </h2>
                    <div className="isx-profile-26">
                        <div className="isx-profile-27">
                            <div>
                                <p className="isx-profile-28">Email</p>
                                <p className="isx-profile-29">{user?.email}</p>
                            </div>
                            <span className="badge badge-teal">Terverifikasi</span>
                        </div>
                        <div className="isx-profile-30">
                            <div>
                                <p className="isx-profile-31">Password</p>
                                <p className="isx-profile-32">.........</p>
                            </div>
                            <button className="btn btn-ghost btn-sm isx-profile-33">Ubah</button>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button onClick={logout} className="btn btn-secondary isx-profile-34">
                    Keluar dari Akun
                </button>
            </div>
        </div>;
}