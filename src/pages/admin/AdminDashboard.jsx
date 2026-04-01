import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import './Admin.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="loading-screen"><div className="spinner" /></div>;

  const CARDS = [
    { icon: '👥', label: t('admin.total_users'),     value: stats.totalUsers,        highlight: false },
    { icon: '📋', label: t('admin.active_profiles'), value: stats.activeProfiles,    highlight: false },
    { icon: '🚩', label: t('admin.open_reports'),    value: stats.openReports,       highlight: stats.openReports > 0 },
    { icon: '💬', label: t('admin.total_messages'),  value: stats.totalMessages,     highlight: false },
    { icon: '🆕', label: t('admin.new_this_week'),   value: stats.newUsersThisWeek,  highlight: false },
    { icon: '🚫', label: t('admin.banned_users'),    value: stats.bannedUsers,       highlight: stats.bannedUsers > 0 },
  ];

  return (
    <div>
      <h1 className="admin-page-title">{t('admin.dashboard')}</h1>
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {CARDS.map(card => (
          <div key={card.label} className={`admin-stat-card ${card.highlight ? 'highlight' : ''}`}>
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-value">{card.value?.toLocaleString()}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
