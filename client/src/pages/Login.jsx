import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>InterviewIQ</span>
        <Link to="/register" style={s.navLink}>Create account →</Link>
      </nav>

      <div style={s.body}>
        <div style={s.left}>
          <p style={s.tag}>AI Interview Platform</p>
          <h1 style={s.bigText}>Practice.<br />Improve.<br />Get hired.</h1>
          <p style={s.desc}>Real interview questions, instant AI feedback, personalized to your role.</p>
          <div style={s.features}>
            {['Real interview questions', 'Instant AI feedback', 'Track your progress'].map(f => (
              <div key={f} style={s.feature}>
                <span style={s.dot} />
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <h2 style={s.formTitle}>Sign in to your account</h2>
            <p style={s.formSub}>Welcome back. Enter your details below.</p>
            {error && <p style={s.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" placeholder="you@company.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              <button style={s.btn} type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p style={s.switch}>Don't have an account? <Link to="/register" style={s.switchLink}>Register for free</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f0', color: '#111', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 56px', background: '#fff', borderBottom: '1px solid #e8e8e8' },
  logo: { fontSize: '16px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' },
  navLink: { fontSize: '13px', color: '#111', textDecoration: 'none', fontWeight: '500' },
  body: { display: 'flex', flex: 1, padding: '64px 56px', gap: '80px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
  left: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tag: { fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' },
  bigText: { fontSize: '44px', fontWeight: '800', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-1.5px', color: '#111' },
  desc: { fontSize: '15px', color: '#666', lineHeight: 1.75, maxWidth: '380px', marginBottom: '32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature: { display: 'flex', alignItems: 'center', gap: '10px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#111', flexShrink: 0 },
  featureText: { fontSize: '14px', color: '#444' },
  right: { width: '420px', display: 'flex', alignItems: 'center' },
  card: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '40px', width: '100%', boxSizing: 'border-box' },
  formTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '6px', color: '#111' },
  formSub: { fontSize: '14px', color: '#888', marginBottom: '28px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '6px' },
  input: { display: 'block', width: '100%', padding: '11px 14px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: '8px', color: '#111', fontSize: '14px', marginBottom: '18px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#111', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' },
  error: { fontSize: '13px', color: '#dc2626', marginBottom: '16px', padding: '10px 14px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fff5f5' },
  switch: { fontSize: '13px', color: '#888', marginTop: '20px', textAlign: 'center' },
  switchLink: { color: '#111', textDecoration: 'none', fontWeight: '600' },
}