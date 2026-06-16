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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>GET STARTED</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start your AI-powered interview journey</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/" style={styles.anchor}>Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 70%)',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    backdropFilter: 'blur(20px)',
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
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '32px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'block',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '8px',
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#6b7280',
    fontSize: '14px',
  },
  anchor: {
    color: '#818cf8',
    textDecoration: 'none',
    fontWeight: '600',
  }
}   