import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, LogIn, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { setAdminToken, clearAdminToken } from '../../lib/adminApi';
import '../../styles/pages/auth-login.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.intendedPath || location.state?.from;
  const fromSource = location.state?.source;
  const isProtectedRedirect = location.state?.reason === 'protected';
  const backTarget = fromPath && fromPath !== '/login' && fromPath !== '/admin/login' && !isProtectedRedirect ? fromPath : '/';
  const postLoginTarget = fromPath && !String(fromPath).startsWith('/admin') && fromPath !== '/login' && fromPath !== '/admin/login' ? fromPath : '/profil';

  const handleBack = () => {
    if (isProtectedRedirect) {
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
      navigate('/');
      return;
    }
    navigate(backTarget);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Isi semua kolom terlebih dahulu');
      return;
    }
    setLoading(true);
    try {
      const session = await login(email, password);
      const role = session?.pengguna?.role || session?.user?.user_metadata?.role;
      const accessToken = session?.access_token || session?.accessToken;

      if (role === 'admin') {
        if (accessToken) setAdminToken(accessToken);
        toast.success('Login admin berhasil');
        navigate('/admin');
        return;
      }

      clearAdminToken();
      toast.success('Selamat datang kembali!');
      navigate(postLoginTarget);
    } catch (err) {
      toast.error(err.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };
  return <div className="bg-dots isx-login-1">
      <div className="orb orb-pink isx-login-2" />
      <div className="orb orb-purple isx-login-3" />

      <div className="isx-login-4">
        <button type="button" className="isx-login-back-btn" onClick={handleBack}>
          <ArrowLeft size={16} /> {isProtectedRedirect || fromSource ? 'Kembali ke Halaman Sebelumnya' : 'Kembali'}
        </button>
        <h1 className="isx-login-5">Portal KIA</h1>
        <div className="isx-login-6" />
      </div>

      <div className="glass-card animate-slideUp isx-login-7">
        <div className="isx-login-8">
          <div className="isx-login-9">
            <User size={28} color="white" />
          </div>
          <h1 className="isx-login-10">Selamat Datang</h1>
          <p className="isx-login-11">
            Silakan masuk untuk mengakses Portal Kesehatan Ibu dan Anak Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="isx-login-12">
          <div className="form-group">
            <label className="form-label">Username atau Email</label>
            <div className="isx-login-13">
              <Mail size={16} className="isx-login-14" />
              <input type="text" className="form-input isx-login-15" placeholder="Masukkan username atau email" value={email} onChange={e => setEmail(e.target.value)} id="login-email" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <div className="isx-login-16">
              <Lock size={16} className="isx-login-17" />
              <input type={showPass ? 'text' : 'password'} className="form-input isx-login-18" placeholder="Masukkan kata sandi" value={password} onChange={e => setPassword(e.target.value)} id="login-password" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="isx-login-19">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="isx-login-20">
            <Link to="#" className="isx-login-21">
              Lupa Kata Sandi?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary isx-login-22" disabled={loading} id="btn-login">
            {loading ? <span className="animate-spin isx-login-23" /> : <>
                <LogIn size={16} /> Masuk
              </>}
          </button>
        </form>

      </div>
    </div>;
}