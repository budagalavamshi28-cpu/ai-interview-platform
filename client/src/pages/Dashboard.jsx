import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>⚡ InterviewAI</div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </nav>

      <div style={styles.hero}>
        <div style={styles.badge}>READY TO PRACTICE</div>
        <h1 style={styles.title}>Welcome back, <span style={styles.highlight}>{user.name}</span> 👋</h1>
        <p style={styles.subtitle}>Choose an interview type to get started</p>
      </div>

      <div style={styles.grid}>
        {[
          { icon: '💻', title: 'Technical', desc: 'DSA, System Design, Coding', color: '#6366f1' },
          { icon: '🧠', title: 'Behavioral', desc: 'HR questions, Situational', color: '#8b5cf6' },
          { icon: '🎯', title: 'Domain', desc: 'Role specific questions', color: '#a855f7' },
          { icon: '⚡', title: 'Mixed', desc: 'All round interview prep', color: '#d946ef' },
        ].map((item, i) => (
          <div key={i} style={{...styles.card, borderColor: item.color + '40'}}>
            <div style={{...styles.iconBox, background: item.color + '20', color: item.color}}>
              {item.icon}
            </div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardDesc}>{item.desc}</p>
            <button style={{...styles.startBtn, background: item.color}}>
              Start Interview →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 70%)',
    padding: '0 24px 48px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '48px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#818cf8',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '10px',
    fontSize: '14px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.4)',
    color: '#818cf8',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  highlight: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: '20px',
    padding: '28px',
    transition: 'transform 0.2s',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  cardDesc: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '20px',
  },
  startBtn: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
  }
}