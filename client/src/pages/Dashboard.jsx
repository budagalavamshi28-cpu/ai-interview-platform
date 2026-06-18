import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [role, setRole] = useState('Full Stack Developer')
  const [type, setType] = useState('Technical')
  const navigate = useNavigate()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');"
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const roles = [
    'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Data Scientist', 'ML Engineer', 'DevOps Engineer',
    'Product Manager', 'UI/UX Designer', 'Android Developer', 'iOS Developer'
  ]

  const types = ['Technical', 'Behavioral', 'HR', 'Domain', 'Mixed']

  const typeDesc = {
    Technical: 'Concepts & problem solving',
    Behavioral: 'Situations & soft skills',
    HR: 'Tell me about yourself & fit',
    Domain: 'Tools & best practices',
    Mixed: 'All of the above',
  }

  const typeIcon = {
    Technical: '💻',
    Behavioral: '🧠',
    HR: '🤝',
    Domain: '🔧',
    Mixed: '⚡',
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>InterviewIQ</span>
        <div style={s.navRight}>
          <span style={s.navTag}>AI-Powered Practice</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      <div style={s.main}>
        <p style={s.eyebrow}>Dashboard</p>
        <h1 style={s.heading}>Set up your <span style={{color: C.purpleMid}}>AI Interview</span></h1>
        <p style={s.subtext}>Choose your target role and interview style to begin a focused practice session.</p>

        <div style={s.card}>
          <label style={s.label}>Target Role</label>
          <select style={s.select} value={role} onChange={e => setRole(e.target.value)}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <label style={{...s.label, marginTop: '24px'}}>Interview Type</label>
          <div style={s.typeGrid}>
            {types.map(t => (
              <button key={t} style={{...s.typeBtn, ...(type === t ? s.typeBtnActive : {})}} onClick={() => setType(t)}>
                <span style={s.typeIcon}>{typeIcon[t]}</span>
                <span style={{...s.typeName, color: type === t ? C.purpleMid : C.text}}>{t}</span>
                <span style={s.typeDesc}>{typeDesc[t]}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.summaryCard}>
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Role</span>
            <span style={s.summaryValue}>{role}</span>
          </div>
          <div style={s.divider} />
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Type</span>
            <span style={s.summaryValue}>{type}</span>
          </div>
          <div style={s.divider} />
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Questions</span>
            <span style={s.summaryValue}>5</span>
          </div>
          <div style={s.divider} />
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Mode</span>
            <span style={s.summaryValue}>Voice + Text</span>
          </div>
        </div>

        <button style={s.primaryBtn} onClick={() => navigate('/interview', { state: { role, type } })}>
          Start Interview →
        </button>
      </div>
    </div>
  )
}

const C = {
  bg: '#FAFAFE', card: '#FFFFFF', purple: '#5B21B6', purpleMid: '#7C3AED',
  purpleLight: '#EDE9FF', purpleBorder: '#DDD6FE', text: '#1A0A3C',
  muted: '#9090A0', border: '#E8E4FF', surface: '#F4F0FF'
}

const s = {
  page: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: '#fff', borderBottom: `1px solid ${C.border}` },
  logo: { fontSize: '18px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.3px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  navTag: { fontSize: '11px', color: C.purpleMid, background: C.purpleLight, border: `1px solid ${C.purpleBorder}`, borderRadius: '6px', padding: '4px 12px', fontWeight: '600' },
  logoutBtn: { fontSize: '12px', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '600' },
  main: { maxWidth: '640px', margin: '0 auto', padding: '52px 24px' },
  eyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' },
  heading: { fontSize: '34px', fontWeight: '700', color: C.text, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.2 },
  subtext: { fontSize: '14px', color: C.muted, lineHeight: 1.7, marginBottom: '32px' },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '28px 32px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' },
  select: { width: '100%', padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none', cursor: 'pointer', boxSizing: 'border-box' },
  typeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  typeBtn: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s ease' },
  typeBtnActive: { background: C.purpleLight, border: `2px solid ${C.purpleMid}` },
  typeIcon: { fontSize: '18px', marginBottom: '6px' },
  typeName: { fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '3px' },
  typeDesc: { fontSize: '11px', color: C.muted },
  summaryCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px 28px', marginBottom: '24px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
  summaryLabel: { fontSize: '12px', color: C.muted, fontWeight: '500' },
  summaryValue: { fontSize: '13px', color: C.purple, fontWeight: '700' },
  divider: { height: '1px', background: C.border },
  primaryBtn: { padding: '14px 32px', background: C.purpleMid, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Sora', sans-serif" },
}