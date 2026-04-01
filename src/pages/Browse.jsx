import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FilterSidebar from '../components/FilterSidebar';
import ProfileCard from '../components/ProfileCard';
import { searchProfiles } from '../services/profileService';
import './Browse.css';

const SORT_OPTIONS = ['newest','most_viewed','age_asc','age_desc','featured'];

export default function Browse() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ gender: '', sort: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProfiles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const { data } = await searchProfiles(params);
      setProfiles(data.profiles);
      setPagination(data.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProfiles(1); }, [fetchProfiles]);

  return (
    <div className="browse-page page-wrapper">
      <div className="container browse-container">
        {/* Page Header */}
        <div className="browse-header">
          <div>
            <h1 className="browse-title">{t('browse.title')}</h1>
            <p className="browse-subtitle">{t('browse.subtitle')}</p>
          </div>
          <div className="browse-header-actions">
            <select
              className="form-select browse-sort"
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{t(`browse.sort_${opt}`)}</option>
              ))}
            </select>
            <button
              className="btn btn-secondary browse-filter-toggle"
              onClick={() => setShowFilters(f => !f)}
            >
              ⚙ {t('browse.filters')}
            </button>
          </div>
        </div>

        {/* Result count */}
        <p className="browse-count">
          {t('browse.results_count', { count: pagination.total })}
        </p>

        <div className="browse-layout">
          {/* Filter sidebar — desktop always visible, mobile toggled */}
          <div className={`browse-sidebar ${showFilters ? 'show' : ''}`}>
            <FilterSidebar filters={filters} onChange={f => setFilters({ ...f, sort: filters.sort })} />
          </div>

          {/* Profile grid */}
          <div className="browse-main">
            {loading ? (
              <div className="browse-loading">
                <div className="spinner" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="browse-empty card">
                <div className="browse-empty-icon">🔍</div>
                <h3>{t('browse.no_results')}</h3>
                <button className="btn btn-outline" onClick={() => setFilters({ gender: '', sort: 'newest' })}>
                  {t('browse.clear_filters')}
                </button>
              </div>
            ) : (
              <div className="profiles-grid">
                {profiles.map(p => (
                  <ProfileCard key={p._id} profile={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="browse-pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${pagination.page === page ? 'active' : ''}`}
                    onClick={() => fetchProfiles(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
