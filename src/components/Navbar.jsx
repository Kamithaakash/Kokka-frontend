import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
  </svg>
);

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon"><HeartIcon /></span>
          <span className="navbar-logo-text">Soul<span>Match</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {t('nav.browse')}
          </NavLink>
          {user && (
            <>
              <NavLink to="/inbox" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {t('nav.inbox')}
              </NavLink>
              <NavLink to="/my-profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {t('nav.myProfile')}
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  {t('nav.admin')}
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          <LanguageSwitcher />
          {user ? (
            <div className="navbar-user">
              <Link to="/my-profile" className="navbar-avatar-btn">
                <div className="avatar avatar-sm navbar-avatar">
                  {user.profile?.profilePhoto
                    ? <img src={user.profile.profilePhoto} alt="" className="avatar avatar-sm" />
                    : <span>{(user.email || '?')[0].toUpperCase()}</span>
                  }
                </div>
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-secondary btn-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </div>
          )}
          {/* Hamburger */}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>{t('nav.home')}</NavLink>
          <NavLink to="/browse" onClick={() => setMenuOpen(false)}>{t('nav.browse')}</NavLink>
          {user && (
            <>
              <NavLink to="/inbox" onClick={() => setMenuOpen(false)}>{t('nav.inbox')}</NavLink>
              <NavLink to="/my-profile" onClick={() => setMenuOpen(false)}>{t('nav.myProfile')}</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setMenuOpen(false)}>{t('nav.admin')}</NavLink>
              )}
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>{t('nav.logout')}</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-secondary btn-sm">{t('nav.login')}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </>
          )}
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
