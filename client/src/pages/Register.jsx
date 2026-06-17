import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form)
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
        <Link to="/" style={s.navLink}>Sign in →</Link>
      </nav>

      <div style={s.body}>
        <div style={s.left}>
          <p style={s.tag}>Get started for free</p>
          <h1 style={s.bigText}>Your interview<br />prep starts here.</h1>
          <p style={s.desc}>Join thousands of candidates who use InterviewIQ to land their dream job.</p>
          <div style={s.stats}>
            {[['500+', 'Questions'], ['10K+', 'Users'], ['95%', 'Success rate']].map(([num, label]) => (
              <div key={label} style={s.stat}>
                <span style={s.statNum}>{num}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.right}>
          <div style={s.card}>
            <h2 style={s.formTitle}>Create your account</h2>
            <p style={s.formSub}>Free forever. No credit card required.</p>
            {error && <p style={s.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Full name</label>
              <input style={s.input} type="text" placeholder="Vamshi Pandu"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" placeholder="you@company.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              <button style={s.btn} type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create free account'}
              </button>
            </form>
            <p style={s.switch}>Already have an account? <Link to="/" style={s.switchLink}>Sign in</Link></p>
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
  desc: { fontSize: '15px', color: '#666', lineHeight: 1.75, maxWidth: '380px', marginBottom: '40px' },
  stats: { display: 'flex', gap: '40px' },
  stat: { display: 'flex', flexDirection: 'column' },
  statNum: { fontSize: '28px', fontWeight: '800', color: '#111' },
  statLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
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