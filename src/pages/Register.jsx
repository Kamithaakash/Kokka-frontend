import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import './AuthPages.css';
import './Register.css';

const RELIGIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Other'];
const ETHNICITIES = ['Sinhalese', 'Tamil', 'Muslim', 'Burgher', 'Other'];
const INDUSTRIES = ['IT & Technology','Healthcare & Medicine','Education & Teaching','Finance & Banking','Engineering','Legal','Business & Trade','Government & Public Service','Arts & Media','Hospitality & Tourism','Construction','Agriculture','Other'];
const EDUCATION_LEVELS = ["O/L's","A/L's","Bachelor's","Master's",'PhD','Diploma','Other'];
const INCOME_RANGES = ['Below 30k LKR','30k–60k LKR','60k–100k LKR','100k–200k LKR','200k+ LKR','Prefer not to say'];
const PROVINCES = ['Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa'];
const HOBBIES_LIST = ['Reading','Cooking','Travel','Music','Sports','Photography','Gardening','Dancing','Art & Crafts','Gaming','Yoga','Cinema'];

const STEPS = ['step1','step2','step3','step4','step5'];
const STEP_LABELS = { step1:'Basic Info', step2:'Location', step3:'Career', step4:'Lifestyle', step5:'About' };

const initialForm = {
  email:'', password:'', displayName:'', gender:'male',
  dateOfBirth:'', religion:'', ethnicity:'', maritalStatus:'never_married',
  height:'', country:'Sri Lanka', province:'', city:'',
  educationLevel:'', educationField:'', institution:'',
  jobTitle:'', industry:'', employer:'', incomeRange:'',
  smoking: false, drinking: false, dietType:'omnivore', hobbies:[],
  aboutMe:'', partnerExpectations:'',
};

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleHobby = (h) => set('hobbies', form.hobbies.includes(h) ? form.hobbies.filter(x=>x!==h) : [...form.hobbies, h]);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      await registerUser({
        email: form.email, password: form.password,
        displayName: form.displayName, gender: form.gender,
        dateOfBirth: form.dateOfBirth, maritalStatus: form.maritalStatus,
      });
      navigate('/login?registered=1');
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="register-card card fade-in-up">
        <div className="auth-logo">💕 SoulMatch</div>
        <h1 className="auth-title">{t('register.title')}</h1>

        {/* Step Progress */}
        <div className="reg-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`reg-step-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="reg-dot">{i < step ? '✓' : i + 1}</div>
              <span className="reg-dot-label">{STEP_LABELS[s]}</span>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="reg-body">
          {/* Step 1 — Basic Info */}
          {step === 0 && (
            <div className="reg-step fade-in">
              <div className="form-group">
                <label className="form-label">{t('register.fields.email')}</label>
                <input id="reg-email" type="email" className="form-input" value={form.email} onChange={e=>set('email',e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.password')}</label>
                <input id="reg-password" type="password" className="form-input" value={form.password} onChange={e=>set('password',e.target.value)} minLength={6} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.displayName')}</label>
                <input id="reg-name" type="text" className="form-input" value={form.displayName} onChange={e=>set('displayName',e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.gender')}</label>
                <div className="reg-gender-row">
                  {['male','female'].map(g=>(
                    <button type="button" key={g} className={`reg-gender-btn ${form.gender===g?'active':''}`} onClick={()=>set('gender',g)}>
                      {g==='male' ? `♂ ${t('register.fields.male')}` : `♀ ${t('register.fields.female')}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.dateOfBirth')}</label>
                <input id="reg-dob" type="date" className="form-input" value={form.dateOfBirth} onChange={e=>set('dateOfBirth',e.target.value)} required />
              </div>
              <div className="reg-row">
                <div className="form-group">
                  <label className="form-label">{t('register.fields.religion')}</label>
                  <select className="form-select" value={form.religion} onChange={e=>set('religion',e.target.value)}>
                    <option value="">{t('common.all')}</option>
                    {RELIGIONS.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('register.fields.ethnicity')}</label>
                  <select className="form-select" value={form.ethnicity} onChange={e=>set('ethnicity',e.target.value)}>
                    <option value="">{t('common.all')}</option>
                    {ETHNICITIES.map(e=><option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.maritalStatus')}</label>
                <select className="form-select" value={form.maritalStatus} onChange={e=>set('maritalStatus',e.target.value)}>
                  <option value="never_married">{t('register.fields.never_married')}</option>
                  <option value="divorced">{t('register.fields.divorced')}</option>
                  <option value="widowed">{t('register.fields.widowed')}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2 — Location */}
          {step === 1 && (
            <div className="reg-step fade-in">
              <div className="form-group">
                <label className="form-label">{t('register.fields.province')}</label>
                <select className="form-select" value={form.province} onChange={e=>set('province',e.target.value)}>
                  <option value="">Select Province</option>
                  {PROVINCES.map(p=><option key={p} value={p}>{p} Province</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.city')}</label>
                <input type="text" className="form-input" value={form.city} onChange={e=>set('city',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.height')} (cm)</label>
                <input type="number" className="form-input" value={form.height} onChange={e=>set('height',e.target.value)} placeholder="168" min="140" max="220" />
              </div>
            </div>
          )}

          {/* Step 3 — Career */}
          {step === 2 && (
            <div className="reg-step fade-in">
              <div className="form-group">
                <label className="form-label">{t('register.fields.educationLevel')}</label>
                <select className="form-select" value={form.educationLevel} onChange={e=>set('educationLevel',e.target.value)}>
                  <option value="">Select Level</option>
                  {EDUCATION_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="reg-row">
                <div className="form-group">
                  <label className="form-label">{t('register.fields.educationField')}</label>
                  <input type="text" className="form-input" value={form.educationField} onChange={e=>set('educationField',e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('register.fields.institution')}</label>
                  <input type="text" className="form-input" value={form.institution} onChange={e=>set('institution',e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.industry')}</label>
                <select className="form-select" value={form.industry} onChange={e=>set('industry',e.target.value)}>
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.jobTitle')}</label>
                <input type="text" className="form-input" value={form.jobTitle} onChange={e=>set('jobTitle',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.incomeRange')}</label>
                <select className="form-select" value={form.incomeRange} onChange={e=>set('incomeRange',e.target.value)}>
                  <option value="">Prefer not to say</option>
                  {INCOME_RANGES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 4 — Lifestyle */}
          {step === 3 && (
            <div className="reg-step fade-in">
              <div className="reg-toggles">
                <label className="reg-toggle">
                  <span>{t('register.fields.smoking')}</span>
                  <input type="checkbox" checked={form.smoking} onChange={e=>set('smoking',e.target.checked)} />
                  <div className="reg-toggle-slider" />
                </label>
                <label className="reg-toggle">
                  <span>{t('register.fields.drinking')}</span>
                  <input type="checkbox" checked={form.drinking} onChange={e=>set('drinking',e.target.checked)} />
                  <div className="reg-toggle-slider" />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.diet')}</label>
                <select className="form-select" value={form.dietType} onChange={e=>set('dietType',e.target.value)}>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.hobbies')}</label>
                <div className="reg-hobbies">
                  {HOBBIES_LIST.map(h=>(
                    <button type="button" key={h} className={`tag ${form.hobbies.includes(h)?'active':''}`} onClick={()=>toggleHobby(h)}>{h}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — About */}
          {step === 4 && (
            <div className="reg-step fade-in">
              <div className="form-group">
                <label className="form-label">{t('register.fields.aboutMe')}</label>
                <textarea className="form-textarea" rows={5} maxLength={1000} value={form.aboutMe} onChange={e=>set('aboutMe',e.target.value)} placeholder="Tell others about yourself..." />
                <span className="reg-char-count">{form.aboutMe.length}/1000</span>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.fields.partnerExpectations')}</label>
                <textarea className="form-textarea" rows={5} maxLength={1000} value={form.partnerExpectations} onChange={e=>set('partnerExpectations',e.target.value)} placeholder="Describe your ideal partner..." />
                <span className="reg-char-count">{form.partnerExpectations.length}/1000</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="reg-nav">
          {step > 0 && (
            <button type="button" className="btn btn-secondary" onClick={()=>setStep(s=>s-1)}>
              ← {t('register.back')}
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={()=>setStep(s=>s+1)} style={{marginLeft:'auto'}}>
              {t('register.next')} →
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{marginLeft:'auto'}}>
              {loading ? t('common.loading') : t('register.submit')}
            </button>
          )}
        </div>

        <p className="auth-switch">
          {t('register.already_have_account')}{' '}
          <Link to="/login">{t('register.login_link')}</Link>
        </p>
      </div>
    </div>
  );
}
