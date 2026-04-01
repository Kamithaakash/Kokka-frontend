import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Admin.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'users', icon: '👥', end: false },
  { to: '/admin/reports', label: 'reports', icon: '🚩', end: false },
  { to: '/admin/featured', label: 'featured', icon: '⭐', end: false },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  return (
    <div className="admin-page page-wrapper">
      <div className="admin-layout">
        <aside className="admin-sidebar card">
          <div className="admin-sidebar-logo">🛡️ {t('admin.title')}</div>
          <nav className="admin-nav">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {t(`admin.${item.label}`)}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
