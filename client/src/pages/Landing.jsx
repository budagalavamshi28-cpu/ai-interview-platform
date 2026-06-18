import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');"
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const features = [
    { icon: '🤖', title: 'AI-Generated Questions', desc: 'Powered by Groq LLaMA 3 — questions tailored to your role and interview type in real time.' },
    { icon: '🎤', title: 'Voice Mode', desc: 'AI speaks every question aloud. Answer using your mic or type — just like a real interview.' },
    { icon: '📊', title: 'Instant Scoring', desc: 'Get scored 1–10 after every answer with detailed feedback on what you did well and what to improve.' },
    { icon: '🤝', title: 'HR Round Included', desc: 'Practice "Tell me about yourself" and other HR classics with a friendly AI HR manager.' },
    { icon: '🧠', title: '5 Interview Types', desc: 'Technical, Behavioral, HR, Domain, and Mixed — all in one platform.' },
    { icon: '💬', title: 'Real Interviewer Feel', desc: 'The AI responds conversationally after every answer, not just with robotic scores.' },
  ]

  const steps = [
    { num: '01', title: 'Create your account', desc: 'Sign up free in seconds. No credit card needed.' },
    { num: '02', title: 'Pick your role & type', desc: 'Choose your target job role and interview style.' },
    { num: '03', title: 'Start your session', desc: 'Answer 5 AI-generated questions with voice or text.' },
    { num: '04', title: 'Get your results', desc: 'See your score, feedback, and areas to improve.' },
  ]

  const types = [
    { label: 'Technical', icon: '💻', desc: 'DSA, system design, concepts' },
    { label: 'Behavioral', icon: '🧠', desc: 'Situations & soft skills' },
    { label: 'HR', icon: '🤝', desc: 'Background & personality fit' },
    { label: 'Domain', icon: '🔧', desc: 'Tools & best practices' },
    { label: 'Mixed', icon: '⚡', desc: 'All of the above' },
  ]

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.logo}>PrepAI</span>
        <div style={s.navLinks}>
          <button style={s.navGhost} onClick={() => navigate('/login')}>Sign In</button>
          <button style={s.navBtn} onClick={() => navigate('/register')}>Get Started Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBadge}>🚀 Powered by Groq + LLaMA 3</div>
        <h1 style={s.heroHeading}>
          Practice Interviews with<br />
          <span style={{color: C.purpleMid}}>Real AI Feedback</span>
        </h1>
        <p style={s.heroSub}>
          PrepAI gives you a real interview experience — AI-generated questions,
          voice mode, instant scoring, and conversational feedback. Built for freshers
          and experienced devs who want to actually get hired.
        </p>
        <div style={s.heroBtns}>
          <button style={s.primaryBtn} onClick={() => navigate('/register')}>
            Start Practicing Free →
          </button>
          <button style={s.outlineBtn} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
        <div style={s.heroStats}>
          <div style={s.stat}><span style={s.statNum}>5</span><span style={s.statLabel}>Interview Types</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><span style={s.statNum}>3</span><span style={s.statLabel}>AI Models Used</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><span style={s.statNum}>100%</span><span style={s.statLabel}>Free to Use</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><span style={s.statNum}>Voice</span><span style={s.statLabel}>Enabled</span></div>
        </div>
      </section>

      {/* INTERVIEW TYPES */}
      <section style={s.section}>
        <p style={s.eyebrow}>Interview Types</p>
        <h2 style={s.sectionHeading}>One platform, every round</h2>
        <p style={s.sectionSub}>From DSA to HR — practice every round you'll face in a real interview process.</p>
        <div style={s.typesGrid}>
          {types.map(t => (
            <div key={t.label} style={s.typeCard}>
              <span style={s.typeIcon}>{t.icon}</span>
              <p style={s.typeName}>{t.label}</p>
              <p style={s.typeDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{...s.section, background: C.surface}}>
        <p style={s.eyebrow}>Features</p>
        <h2 style={s.sectionHeading}>Everything you need to crack interviews</h2>
        <p style={s.sectionSub}>Built with the latest AI to give you the most realistic interview prep experience.</p>
        <div style={s.featGrid}>
          {features.map(f => (
            <div key={f.title} style={s.featCard}>
              <span style={s.featIcon}>{f.icon}</span>
              <p style={s.featTitle}>{f.title}</p>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.section}>
        <p style={s.eyebrow}>How It Works</p>
        <h2 style={s.sectionHeading}>Ready in under 2 minutes</h2>
        <p style={s.sectionSub}>No setup. No confusion. Just open and start practicing.</p>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.num} style={s.stepCard}>
              <span style={s.stepNum}>{step.num}</span>
              <p style={s.stepTitle}>{step.title}</p>
              <p style={s.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div style={s.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaBox}>
          <p style={s.ctaEyebrow}>Free Forever</p>
          <h2 style={s.ctaHeading}>Stop cramming. Start practicing.</h2>
          <p style={s.ctaSub}>Join PrepAI and walk into your next interview with real confidence.</p>
          <button style={s.ctaBtn} onClick={() => navigate('/register')}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={s.footerLogo}>PrepAI</span>
        <p style={s.footerText}>Built with React, Node.js, Groq AI · © 2025</p>
        <div style={s.footerLinks}>
          <button style={s.footerLink} onClick={() => navigate('/login')}>Sign In</button>
          <button style={s.footerLink} onClick={() => navigate('/register')}>Register</button>
        </div>
      </footer>
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

  // NAV
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 64px', background: '#fff', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '20px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.3px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '12px' },
  navGhost: { fontSize: '13px', color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '500', padding: '8px 16px' },
  navBtn: { fontSize: '13px', color: '#fff', background: C.purpleMid, border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: '700', padding: '9px 18px' },

  // HERO
  hero: { maxWidth: '800px', margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' },
  heroBadge: { display: 'inline-block', fontSize: '12px', color: C.purpleMid, background: C.purpleLight, border: `1px solid ${C.purpleBorder}`, borderRadius: '20px', padding: '6px 16px', fontWeight: '600', marginBottom: '28px' },
  heroHeading: { fontSize: '52px', fontWeight: '700', color: C.text, fontFamily: "'Sora', sans-serif", lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '20px' },
  heroSub: { fontSize: '17px', color: C.muted, lineHeight: 1.8, marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px' },
  heroBtns: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '48px' },
  heroStats: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '24px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  statNum: { fontSize: '22px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif" },
  statLabel: { fontSize: '11px', color: C.muted, fontWeight: '500' },
  statDivider: { width: '1px', height: '32px', background: C.border },

  // SECTIONS
  section: { padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' },
  eyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' },
  sectionHeading: { fontSize: '36px', fontWeight: '700', color: C.text, fontFamily: "'Sora', sans-serif', letterSpacing: '-0.5px', marginBottom: '12px", textAlign: 'center', lineHeight: 1.2 },
  sectionSub: { fontSize: '15px', color: C.muted, lineHeight: 1.7, textAlign: 'center', maxWidth: '560px', margin: '0 auto 48px' },

  // TYPES
  typesGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' },
  typeCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px 16px', textAlign: 'center' },
  typeIcon: { fontSize: '24px', display: 'block', marginBottom: '10px' },
  typeName: { fontSize: '13px', fontWeight: '700', color: C.purple, marginBottom: '4px' },
  typeDesc: { fontSize: '11px', color: C.muted, lineHeight: 1.5 },

  // FEATURES
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  featCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px 20px' },
  featIcon: { fontSize: '28px', display: 'block', marginBottom: '14px' },
  featTitle: { fontSize: '15px', fontWeight: '700', color: C.text, marginBottom: '8px', fontFamily: "'Sora', sans-serif" },
  featDesc: { fontSize: '13px', color: C.muted, lineHeight: 1.7 },

  // HOW IT WORKS
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', position: 'relative' },
  stepCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px 20px', position: 'relative' },
  stepNum: { fontSize: '28px', fontWeight: '700', color: C.purpleLight, fontFamily: "'Sora', sans-serif", display: 'block', marginBottom: '12px' },
  stepTitle: { fontSize: '14px', fontWeight: '700', color: C.text, marginBottom: '8px', fontFamily: "'Sora', sans-serif" },
  stepDesc: { fontSize: '12px', color: C.muted, lineHeight: 1.6 },
  stepArrow: { position: 'absolute', right: '-18px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: C.purpleBorder, zIndex: 1 },

  // CTA
  ctaSection: { padding: '64px 24px', background: C.surface },
  ctaBox: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: C.card, border: `2px solid ${C.purpleBorder}`, borderRadius: '20px', padding: '56px 40px' },
  ctaEyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' },
  ctaHeading: { fontSize: '34px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.2 },
  ctaSub: { fontSize: '15px', color: C.muted, lineHeight: 1.7, marginBottom: '32px' },
  ctaBtn: { padding: '15px 36px', background: C.purpleMid, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Sora', sans-serif" },

  // FOOTER
  footer: { padding: '32px 64px', background: '#fff', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLogo: { fontSize: '16px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif" },
  footerText: { fontSize: '12px', color: C.muted },
  footerLinks: { display: 'flex', gap: '16px' },
  footerLink: { fontSize: '12px', color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '500' },

  // BUTTONS
  primaryBtn: { padding: '14px 28px', background: C.purpleMid, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Sora', sans-serif" },
  outlineBtn: { padding: '14px 28px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, fontSize: '15px', fontWeight: '500', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
}