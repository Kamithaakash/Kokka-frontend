import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileCard from '../components/ProfileCard';
import { searchProfiles } from '../services/profileService';
import './Home.css';

const STATS = [
  { number: '12,000+', key: 'profiles' },
  { number: '3,500+', key: 'matches' },
  { number: '4', key: 'religions' },
];

const STEPS = [
  { icon: '📝', key: 'step1' },
  { icon: '🔍', key: 'step2' },
  { icon: '💬', key: 'step3' },
];

export default function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    searchProfiles({ sort: 'featured', limit: 6 })
      .then(r => setFeatured(r.data.profiles || []))
      .catch(() => {});
  }, []);

  return (
    <div className="home page-wrapper">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="container hero-content">
          <div className="hero-text fade-in-up">
            <div className="hero-badge">💕 Sri Lanka's Premier Matrimonial Platform</div>
            <h1 className="hero-title">
              {t('home.hero.title')}<br />
              <span className="gradient-text">{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="hero-subtitle">{t('home.hero.subtitle')}</p>
            <div className="hero-cta-group">
              <Link to="/browse" className="btn btn-primary btn-lg">{t('home.hero.cta_browse')}</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">{t('home.hero.cta_register')}</Link>
            </div>
            <div className="hero-stats">
              {STATS.map(stat => (
                <div key={stat.key} className="hero-stat">
                  <div className="hero-stat-number">{stat.number}</div>
                  <div className="hero-stat-label">{t(`home.hero.stats.${stat.key}`)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="hero-cards-stack">
              <div className="hero-card-sample hero-card-1 card">
                <div className="hcs-avatar" style={{ background: 'linear-gradient(135deg,#C2185B,#7B2D8B)' }}>A</div>
                <div><div className="hcs-name">Amaya, 27</div><div className="hcs-sub">Software Engineer · Colombo</div></div>
              </div>
              <div className="hero-card-sample hero-card-2 card">
                <div className="hcs-avatar" style={{ background: 'linear-gradient(135deg,#2196F3,#7B2D8B)' }}>R</div>
                <div><div className="hcs-name">Roshan, 30</div><div className="hcs-sub">Doctor · Kandy</div></div>
              </div>
              <div className="hero-card-sample hero-card-3 card">
                <div className="hcs-avatar" style={{ background: 'linear-gradient(135deg,#F4A261,#C2185B)' }}>P</div>
                <div><div className="hcs-name">Priya, 25</div><div className="hcs-sub">Teacher · Jaffna</div></div>
              </div>
              <div className="hero-match-badge">💕 Perfect Match!</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('home.howItWorks.title')}</h2>
          </div>
          <div className="how-steps">
            {STEPS.map((step, i) => (
              <div key={step.key} className="how-step card fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="how-step-number">{i + 1}</div>
                <div className="how-step-icon">{step.icon}</div>
                <h3 className="how-step-title">{t(`home.howItWorks.${step.key}_title`)}</h3>
                <p className="how-step-desc">{t(`home.howItWorks.${step.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Profiles ── */}
      {featured.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header flex-between">
              <h2>{t('home.featured.title')}</h2>
              <Link to="/browse" className="btn btn-outline btn-sm">View All →</Link>
            </div>
            <div className="featured-grid">
              {featured.map(p => <ProfileCard key={p._id} profile={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-banner card">
            <h2>Ready to find your perfect match?</h2>
            <p>Join thousands of Sri Lankans who found their life partner on SoulMatch.</p>
            <div className="cta-banner-btns">
              <Link to="/register" className="btn btn-primary btn-lg">{t('home.hero.cta_register')}</Link>
              <Link to="/browse" className="btn btn-secondary btn-lg">{t('home.hero.cta_browse')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
