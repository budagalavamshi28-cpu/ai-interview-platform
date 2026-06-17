import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [selectedRole, setSelectedRole] = useState('Full Stack')

  const logout = () => { localStorage.clear(); navigate('/') }

  const roles = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Science', 'DevOps', 'System Design']

  const types = [
    { label: 'Technical', desc: 'DSA, coding, system design', tag: 'Most popular' },
    { label: 'Behavioral', desc: 'HR, situational, leadership', tag: null },
    { label: 'Domain', desc: 'Role-specific deep dives', tag: null },
    { label: 'Mixed', desc: 'Full round simulation', tag: 'Recommended' },
  ]

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>InterviewIQ</span>
        <div style={s.navRight}>
          <span style={s.navUser}>{user.name}</span>
          <button style={s.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.header}>
          <p style={s.tag}>— Dashboard</p>
          <h1 style={s.title}>Good to see you, <span style={s.highlight}>{user.name?.split(' ')[0]}</span>.</h1>
          <p style={s.sub}>Select a role and interview type to begin your session.</p>
        </div>

        <div style={s.section}>
          <p style={s.sectionLabel}>Target role</p>
          <div style={s.roleGrid}>
            {roles.map(role => (
              <button
                key={role}
                style={{...s.roleBtn, ...(selectedRole === role ? s.roleBtnActive : {})}}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
          <p style={s.selectedText}>Selected: <strong>{selectedRole}</strong></p>
        </div>

        <div style={s.section}>
          <p style={s.sectionLabel}>Interview type</p>
          <div style={s.typeGrid}>
            {types.map(t => (
              <div key={t.label} style={s.typeCard}>
                {t.tag && <span style={s.pill}>{t.tag}</span>}
                <h3 style={s.typeTitle}>{t.label}</h3>
                <p style={s.typeDesc}>{t.desc}</p>
                <button
                  style={s.startBtn}
                  onClick={() => navigate('/interview', { state: { role: selectedRole, type: t.label } })}
                >
                  Start session →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f0', color: '#111', fontFamily: "'Inter', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 56px', background: '#fff', borderBottom: '1px solid #e8e8e8' },
  logo: { fontSize: '16px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  navUser: { fontSize: '13px', color: '#888' },
  logoutBtn: { fontSize: '13px', color: '#111', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: '500' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '56px 56px' },
  header: { marginBottom: '48px' },
  tag: { fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' },
  title: { fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px', color: '#111' },
  highlight: { color: '#16a34a' },
  sub: { fontSize: '15px', color: '#888' },
  section: { marginBottom: '44px' },
  sectionLabel: { fontSize: '11px', fontWeight: '700', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' },
  roleGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' },
  roleBtn: { padding: '9px 18px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', color: '#444', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  roleBtnActive: { background: '#111', color: '#fff', border: '1px solid #111' },
  selectedText: { fontSize: '13px', color: '#888', marginTop: '8px' },
  typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' },
  typeCard: { padding: '24px', border: '1px solid #e8e8e8', borderRadius: '12px', background: '#fff' },
  pill: { display: 'inline-block', fontSize: '10px', color: '#16a34a', border: '1px solid #16a34a40', borderRadius: '20px', padding: '2px 10px', letterSpacing: '1px', marginBottom: '16px' },
  typeTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#111' },
  typeDesc: { fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: 1.6 },
  startBtn: { fontSize: '13px', color: '#111', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600' },
}