import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');"
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleRegister = async () => {
    setError('')
    if (!name || !email || !password) return setError('Please fill in all fields.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>PrepAI</span>
      </nav>

      <div style={s.main}>
        <div style={s.card}>
          <p style={s.eyebrow}>Get started free</p>
          <h1 style={s.heading}>Create your account</h1>
          <p style={s.subtext}>No credit card required. Start practicing in seconds.</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <label style={s.label}>Full name</label>
          <input
            style={s.input} type="text" placeholder="Jane Smith"
            value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
          />

          <label style={{...s.label, marginTop: '16px'}}>Email address</label>
          <input
            style={s.input} type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
          />

          <label style={{...s.label, marginTop: '16px'}}>Password</label>
          <input
            style={s.input} type="password" placeholder="Min. 6 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
          />

          <button style={{...s.primaryBtn, opacity: loading ? 0.55 : 1}} onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p style={s.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>
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
  page: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
  nav: { padding: '16px 48px', background: '#fff', borderBottom: `1px solid ${C.border}` },
  logo: { fontSize: '18px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.3px' },
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '40px 36px', width: '100%', maxWidth: '420px' },
  eyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' },
  heading: { fontSize: '26px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.3px', marginBottom: '6px' },
  subtext: { fontSize: '13px', color: C.muted, lineHeight: 1.6, marginBottom: '24px' },
  errorBox: { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', marginBottom: '16px' },
  label: { display: 'block', fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '4px' },
  primaryBtn: { width: '100%', padding: '13px', background: C.purpleMid, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginTop: '24px', marginBottom: '20px' },
  footerText: { fontSize: '13px', color: C.muted, textAlign: 'center' },
  link: { color: C.purpleMid, fontWeight: '700', textDecoration: 'none' },
}