import { useTranslation } from 'react-i18next';
import './FilterSidebar.css';

const RELIGIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Other'];
const ETHNICITIES = ['Sinhalese', 'Tamil', 'Muslim', 'Burgher', 'Other'];
const INDUSTRIES = [
  'IT & Technology', 'Healthcare & Medicine', 'Education & Teaching',
  'Finance & Banking', 'Engineering', 'Legal', 'Business & Trade',
  'Government & Public Service', 'Arts & Media', 'Hospitality & Tourism',
  'Construction', 'Agriculture', 'Other',
];
const EDUCATION_LEVELS = ["O/L's", "A/L's", "Bachelor's", "Master's", 'PhD', 'Diploma', 'Other'];
const MARITAL_STATUSES = ['never_married', 'divorced', 'widowed'];
const PROVINCES = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa',
];
const HOBBIES = [
  'Reading', 'Cooking', 'Travel', 'Music', 'Sports', 'Photography',
  'Gardening', 'Dancing', 'Art & Crafts', 'Gaming', 'Yoga', 'Cinema',
];

const INDUSTRY_ICONS = {
  'IT & Technology': '💻', 'Healthcare & Medicine': '🏥', 'Education & Teaching': '📚',
  'Finance & Banking': '🏦', 'Engineering': '⚙️', 'Legal': '⚖️',
  'Business & Trade': '🏢', 'Government & Public Service': '🏛️', 'Arts & Media': '🎨',
  'Hospitality & Tourism': '🌴', 'Construction': '🏗️', 'Agriculture': '🌾', 'Other': '💼',
};

export default function FilterSidebar({ filters, onChange }) {
  const { t } = useTranslation();

  const toggle = (field, value) => {
    const current = filters[field] ? filters[field].split(',').filter(Boolean) : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [field]: updated.join(',') });
  };

  const isChecked = (field, value) =>
    filters[field] ? filters[field].split(',').includes(value) : false;

  const clearAll = () => onChange({ gender: '', ageMin: '', ageMax: '', sort: 'newest' });

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <h3 className="filter-sidebar-title">{t('browse.filters')}</h3>
        <button className="filter-clear-btn" onClick={clearAll}>{t('browse.clear_filters')}</button>
      </div>

      {/* Gender */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.gender')}</h4>
        <div className="filter-gender-btns">
          {['', 'male', 'female'].map((g) => (
            <button
              key={g}
              className={`filter-gender-btn ${filters.gender === g ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, gender: g })}
            >
              {g === '' ? t('common.all') : g === 'male' ? `♂ ${t('register.fields.male')}` : `♀ ${t('register.fields.female')}`}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.age_range')}</h4>
        <div className="filter-age-row">
          <input type="number" className="form-input filter-age-input" placeholder="18"
            value={filters.ageMin || ''} min="18" max="80"
            onChange={(e) => onChange({ ...filters, ageMin: e.target.value })} />
          <span className="filter-age-sep">—</span>
          <input type="number" className="form-input filter-age-input" placeholder="60"
            value={filters.ageMax || ''} min="18" max="80"
            onChange={(e) => onChange({ ...filters, ageMax: e.target.value })} />
        </div>
      </div>

      {/* Religion */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.religion')}</h4>
        <div className="filter-checkboxes">
          {RELIGIONS.map((r) => (
            <label key={r} className="filter-checkbox">
              <input type="checkbox" checked={isChecked('religion', r)}
                onChange={() => toggle('religion', r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.industry')}</h4>
        <div className="filter-checkboxes">
          {INDUSTRIES.map((ind) => (
            <label key={ind} className="filter-checkbox">
              <input type="checkbox" checked={isChecked('industry', ind)}
                onChange={() => toggle('industry', ind)} />
              <span>{INDUSTRY_ICONS[ind]} {ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.education')}</h4>
        <div className="filter-checkboxes">
          {EDUCATION_LEVELS.map((lv) => (
            <label key={lv} className="filter-checkbox">
              <input type="checkbox" checked={isChecked('educationLevel', lv)}
                onChange={() => toggle('educationLevel', lv)} />
              <span>{lv}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Marital Status */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.marital_status')}</h4>
        <div className="filter-checkboxes">
          {MARITAL_STATUSES.map((ms) => (
            <label key={ms} className="filter-checkbox">
              <input type="checkbox" checked={isChecked('maritalStatus', ms)}
                onChange={() => toggle('maritalStatus', ms)} />
              <span>{t(`register.fields.${ms}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Province */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.location')}</h4>
        <select className="form-select" value={filters.province || ''}
          onChange={(e) => onChange({ ...filters, province: e.target.value })}>
          <option value="">{t('common.all')}</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p} Province</option>)}
        </select>
      </div>

      {/* Hobbies */}
      <div className="filter-section">
        <h4 className="filter-section-title">{t('browse.hobbies')}</h4>
        <div className="filter-tags">
          {HOBBIES.map((h) => (
            <button
              key={h}
              className={`tag ${isChecked('hobbies', h) ? 'active' : ''}`}
              onClick={() => toggle('hobbies', h)}
            >{h}</button>
          ))}
        </div>
      </div>
    </aside>
  );
}
