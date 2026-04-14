import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Baby, FileText, ChefHat, Brain, LogOut, Menu, X, Shield, ChevronRight } from 'lucide-react';
import '../../styles/pages/admin-admin-layout.css';
import { clearAdminToken } from '../../lib/adminApi';
import toast from 'react-hot-toast';
const PRIMARY = '#E8307D';
const PRIMARY_LIGHT = '#fde8f3';
const PRIMARY_HOVER_BG = '#fde8f3';
const NAV_ITEMS = [{
  path: '/admin',
  label: 'Dashboard',
  icon: LayoutDashboard,
  exact: true
}, {
  path: '/admin/pengguna',
  label: 'Pengguna',
  icon: Users
}, {
  path: '/admin/content',
  label: 'Semua Konten',
  icon: FileText
}, {
  path: '/admin/parenting',
  label: 'Parenting (Anak)',
  icon: Baby
}, {
  path: '/admin/kesehatan-ibu',
  label: 'Kesehatan Ibu',
  icon: FileText
}, {
  path: '/admin/phbs',
  label: 'PHBS',
  icon: FileText
}, {
  path: '/admin/gizi',
  label: 'Gizi & Menu',
  icon: ChefHat
}, {
  path: '/admin/quiz',
  label: 'Quiz',
  icon: Brain
}];
function NavItem({
  item,
  active,
  sidebarOpen
}) {
  const [hovered, setHovered] = useState(false);
  return <Link to={item.path} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`${sidebarOpen ? 'admin-nav-item' : 'admin-nav-item admin-nav-item-collapsed'}${active ? ' admin-nav-item-active' : ''}${hovered ? ' admin-nav-item-hovered' : ''}`}>
            <item.icon size={18} className="isx-adminlayout-1" />
            {sidebarOpen && <span className="isx-adminlayout-2">{item.label}</span>}
            {sidebarOpen && active && <ChevronRight size={14} className="admin-nav-item-chevron" />}
        </Link>;
}
export default function AdminLayout({
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAdminToken();
    toast.success('Logout berhasil');
    navigate('/admin/login');
  };
  const isActive = item => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };
  return <div className="isx-adminlayout-3">
            {/* Sidebar */}
            <aside className={sidebarOpen ? "isx-adminlayout-4 isx-adminlayout-4--on" : "isx-adminlayout-4 isx-adminlayout-4--off"}>
                {/* Header */}
                <div className="isx-adminlayout-5">
                    <div className="admin-logo-badge">
                        <Shield size={18} color="white" />
                    </div>
                    {sidebarOpen && <div className="isx-adminlayout-6">
                            <div className="isx-adminlayout-7">SEJIWA Admin</div>
                            <div className="isx-adminlayout-8">Panel Kontrol</div>
                        </div>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="isx-adminlayout-9">
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav items */}
                <nav className="isx-adminlayout-10">
                    {NAV_ITEMS.map(item => <NavItem key={item.path} item={item} active={isActive(item)} sidebarOpen={sidebarOpen} />)}
                </nav>

                {/* Logout */}
                <div className="isx-adminlayout-11">
                    <button onClick={handleLogout} onMouseEnter={() => setLogoutHovered(true)} onMouseLeave={() => setLogoutHovered(false)} className={`${sidebarOpen ? 'admin-logout-btn' : 'admin-logout-btn admin-logout-btn-collapsed'}${logoutHovered ? ' admin-logout-btn-hovered' : ''}`}>
                        <LogOut size={18} className="isx-adminlayout-12" />
                        {sidebarOpen && <span className="isx-adminlayout-13">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className={sidebarOpen ? "isx-adminlayout-14 isx-adminlayout-14--on" : "isx-adminlayout-14 isx-adminlayout-14--off"}>
                {children}
            </div>
        </div>;
}

// Page header component
export function AdminPageHeader({
  title,
  subtitle,
  action
}) {
  return <div className="isx-adminlayout-15">
            <div>
                <h1 className="isx-adminlayout-16">{title}</h1>
                {subtitle && <p className="isx-adminlayout-17">{subtitle}</p>}
            </div>
            {action}
        </div>;
}

// Card component
export function AdminCard({
  children,
  className = ''
}) {
  return <div className={`admin-card ${className}`}>
            {children}
        </div>;
}

// Stat card
export function StatCard({
  label,
  value,
  icon: Icon,
  color
}) {
  return <div className="isx-adminlayout-18">
            <div className="admin-stat-icon-wrap">
                <Icon size={22} color={color} />
            </div>
            <div>
                <p className="isx-adminlayout-19">{label}</p>
                <p className="isx-adminlayout-20">{value}</p>
            </div>
        </div>;
}

// Modal
export function AdminModal({
  open,
  onClose,
  title,
  children,
  width = 560
}) {
  if (!open) return null;
  const modalWidthClass = width >= 640 ? 'admin-modal-panel admin-modal-panel-640' : width <= 400 ? 'admin-modal-panel admin-modal-panel-400' : 'admin-modal-panel admin-modal-panel-560';
  return <div onClick={onClose} className="isx-adminlayout-21">
            <div className={modalWidthClass} onClick={e => e.stopPropagation()}>
                <div className="isx-adminlayout-22">
                    <h2 className="isx-adminlayout-23">{title}</h2>
                    <button onClick={onClose} className="isx-adminlayout-24">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>;
}

// Form input helper
export function AdminInput({
  label,
  required,
  className = '',
  style,
  ...props
}) {
  const inputClassName = `admin-input ${className}`.trim();
  return <div className="isx-adminlayout-25">
            {label && <label className="isx-adminlayout-26">
                {label} {required && <span className="isx-adminlayout-27">*</span>}
            </label>}
            {props.type === 'textarea' ? <textarea {...props} className={`${inputClassName} admin-input-textarea`.trim()} /> : props.type === 'select' ? <select {...props} className={`${inputClassName} admin-input-select`.trim()}>
                    {props.children}
                </select> : <input {...props} className={`${inputClassName} admin-input-field`.trim()} />}
        </div>;
}

// Table styles helper
export const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem'
};
export const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  background: '#f8fafc',
  color: '#475569',
  fontWeight: 600,
  fontSize: '0.8125rem',
  borderBottom: '1px solid #e2e8f0'
};
export const tdStyle = {
  padding: '0.875rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  color: '#334155'
};