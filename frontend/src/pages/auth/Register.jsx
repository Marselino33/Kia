import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import '../../styles/pages/auth-register.css';
export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register
  } = useAuthStore();
  const navigate = useNavigate();
  const update = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Isi semua kolom terlebih dahulu');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Password tidak sama');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Akun berhasil dibuat! Silakan masuk. ðŸŽ‰');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Gagal membuat akun');
    } finally {
      setLoading(false);
    }
  };
  const fields = [{
    key: 'name',
    label: 'Nama Lengkap',
    type: 'text',
    icon: User,
    placeholder: 'Nama Anda',
    id: 'reg-name'
  }, {
    key: 'email',
    label: 'Email',
    type: 'email',
    icon: Mail,
    placeholder: 'nama@email.com',
    id: 'reg-email'
  }, {
    key: 'password',
    label: 'Kata Sandi',
    type: showPass ? 'text' : 'password',
    icon: Lock,
    placeholder: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
    id: 'reg-password',
    toggleable: true
  }, {
    key: 'confirm',
    label: 'Konfirmasi Kata Sandi',
    type: showPass ? 'text' : 'password',
    icon: Lock,
    placeholder: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
    id: 'reg-confirm'
  }];
  return <div className="bg-dots isx-register-1">
      <div className="orb orb-teal isx-register-2" />
      <div className="orb orb-purple isx-register-3" />

      <div className="isx-register-4">
        <button type="button" className="isx-register-back-btn" onClick={() => navigate('/login')}>
          <ArrowLeft size={16} /> Kembali ke Login
        </button>
        <h1 className="isx-register-5">Portal KIA</h1>
        <div className="isx-register-6" />
      </div>

      <div className="glass-card animate-slideUp isx-register-7">
        <div className="isx-register-8">
          <div className="isx-register-9">
            <User size={28} color="white" />
          </div>
          <h1 className="isx-register-10">Buat Akun Baru</h1>
          <p className="isx-register-11">
            Buat akun untuk mulai memantau pertumbuhan sang buah hati.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="isx-register-12">
          {fields.map(({
          key,
          label,
          type,
          icon: Icon,
          placeholder,
          id,
          toggleable
        }) => <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <div className="isx-register-13">
                <Icon size={16} className="isx-register-14" />
                <input type={type} className={toggleable ? 'form-input isx-register-20 isx-register-20-toggle' : 'form-input isx-register-20'} placeholder={placeholder} value={form[key]} onChange={update(key)} id={id} />
                {toggleable && <button type="button" onClick={() => setShowPass(!showPass)} className="isx-register-15">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>}
              </div>
            </div>)}

          <button type="submit" className="btn btn-primary isx-register-16" disabled={loading} id="btn-register">
            {loading ? <span className="animate-spin isx-register-17" /> : <>
                <UserPlus size={16} /> Daftar Sekarang
              </>}
          </button>
        </form>

        <p className="isx-register-18">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="isx-register-19">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>;
}