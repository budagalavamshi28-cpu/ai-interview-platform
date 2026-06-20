import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Interview() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questionNum, setQuestionNum] = useState(1)
  const [previousQuestions, setPreviousQuestions] = useState([])
  const [scores, setScores] = useState([])
  const [phase, setPhase] = useState('question')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showScoreDetail, setShowScoreDetail] = useState(false)
  const [voiceSupported] = useState(() => 'speechSynthesis' in window)
  const [micSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  const recognitionRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { role, type } = location.state || { role: 'Full Stack', type: 'Technical' }
  const totalQuestions = 5

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');"
    document.head.appendChild(style)
    generateQuestion()
    return () => document.head.removeChild(style)
  }, [])

  const speakText = (text) => {
    if (!voiceSupported) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.9; utter.pitch = 1; utter.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Google') && v.lang === 'en-US') || voices.find(v => v.lang === 'en-US')
    if (preferred) utter.voice = preferred
    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false) }

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US'
    let finalText = answer
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      setAnswer(finalText + interim)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }

  const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); setIsListening(false) }

  const handleLogout = () => {
    stopSpeaking(); stopListening()
    localStorage.removeItem('token')
    navigate('/login')
  }

  const generateQuestion = async () => {
    setLoading(true); setAnswer(''); setFeedback(null); setPhase('question'); setShowScoreDetail(false); stopSpeaking()
    try {
      const res = await api.post('/api/interview/question', { role, type, previousQuestions })
      setQuestion(res.data.question)
      setPreviousQuestions(prev => [...prev, res.data.question])
      setTimeout(() => speakText(res.data.question), 400)
    } catch (err) { alert('Failed to generate question: ' + (err.response?.data?.message || err.message)) }
    setLoading(false)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    stopListening(); stopSpeaking(); setLoading(true)
    try {
      const res = await api.post('/api/interview/evaluate', { question, answer, role, type })
      setFeedback(res.data)
      setScores(prev => [...prev, res.data.score])
      setPhase('feedback')
      setTimeout(() => speakText(res.data.reply), 300)
    } catch (err) { alert('Failed to evaluate answer.') }
    setLoading(false)
  }

  const nextQuestion = () => {
    if (questionNum >= totalQuestions) setPhase('done')
    else { setQuestionNum(prev => prev + 1); generateQuestion() }
  }

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const scoreColor = (sc) => sc >= 7 ? '#7C3AED' : sc >= 5 ? '#D97706' : '#DC2626'
  const pct = Math.round((questionNum - 1) / totalQuestions * 100)

  if (phase === 'done') {
    return (
      <div style={s.page}>
        <nav style={s.nav}>
          <span style={s.logo}>PrepAI</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Log Out</button>
        </nav>
        <div style={s.doneWrap}>
          <p style={s.eyebrow}>Session Complete</p>
          <h1 style={s.doneHeading}>Your Results</h1>
          <div style={s.bigScoreRow}>
            <span style={{...s.bigScoreNum, color: scoreColor(avgScore)}}>{avgScore}</span>
            <span style={s.bigScoreOf}>/10</span>
          </div>
          <p style={s.avgLabel}>average across {scores.length} questions</p>
          <div style={s.barList}>
            {scores.map((sc, i) => (
              <div key={i} style={s.barRow}>
                <span style={s.barLabel}>Q{i+1}</span>
                <div style={s.barTrack}><div style={{...s.barFill, width: `${sc*10}%`, background: scoreColor(sc)}} /></div>
                <span style={{...s.barNum, color: scoreColor(sc)}}>{sc}/10</span>
              </div>
            ))}
          </div>
          <div style={s.doneBtns}>
            <button style={s.primaryBtn} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            <button style={s.outlineBtn} onClick={() => { setQuestionNum(1); setScores([]); setPreviousQuestions([]); setPhase('question'); generateQuestion() }}>Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>PrepAI</span>
        <div style={s.navMeta}>
          <span style={s.navBadge}>{role}</span>
          <span style={s.navBadge}>{type}</span>
          <button style={s.exitBtn} onClick={() => { stopSpeaking(); stopListening(); navigate('/dashboard') }}>Dashboard</button>
          <button style={s.logoutBtn} onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.progressWrap}>
          <div style={s.progressInfo}>
            <span style={s.progressLabel}>Question {questionNum} of {totalQuestions}</span>
            <span style={s.progressLabel}>{pct}% complete</span>
          </div>
          <div style={s.progressTrack}><div style={{...s.progressFill, width: `${pct}%`}} /></div>
        </div>

        <div style={s.questionCard}>
          <div style={s.questionTop}>
            <span style={s.questionEyebrow}>Question {questionNum}</span>
            {voiceSupported && question && (
              <button style={{...s.iconBtn, ...(isSpeaking ? s.iconBtnActive : {})}}
                onClick={() => isSpeaking ? stopSpeaking() : speakText(question)}>
                {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
              </button>
            )}
          </div>
          {loading && !question ? <p style={s.loadingText}>Generating question...</p> : <p style={s.questionText}>{question}</p>}
          {isSpeaking && phase === 'question' && (
            <div style={s.speakingPill}><span style={s.speakDot} /> Speaking...</div>
          )}
        </div>

        {phase === 'question' && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardLabel}>Your Answer</span>
              {micSupported && (
                <button style={{...s.iconBtn, ...(isListening ? s.iconBtnRed : {})}}
                  onClick={() => isListening ? stopListening() : startListening()}>
                  {isListening ? '⏹ Stop mic' : '🎤 Use mic'}
                </button>
              )}
            </div>
            {isListening && <div style={s.listeningPill}><span style={s.listenDot} /> Listening — speak clearly...</div>}
            <textarea style={s.textarea} rows={5}
              placeholder="Type your answer, or click '🎤 Use mic' to speak..."
              value={answer} onChange={e => setAnswer(e.target.value)} />
            <button style={{...s.primaryBtn, opacity: loading || !answer.trim() ? 0.45 : 1}}
              onClick={submitAnswer} disabled={loading || !answer.trim()}>
              {loading ? 'Evaluating...' : 'Submit Answer →'}
            </button>
          </div>
        )}

        {phase === 'feedback' && feedback && (
          <div>
            <div style={s.replyCard}>
              <div style={s.replyHeader}>
                <div style={s.avatar}>HR</div>
                <div>
                  <p style={s.avatarLabel}>{type === 'HR' ? 'HR Manager' : 'Interviewer'}</p>
                  {isSpeaking && <div style={s.speakingPill}><span style={s.speakDot} /> Speaking...</div>}
                </div>
                {voiceSupported && (
                  <button style={{...s.iconBtn, marginLeft: 'auto', ...(isSpeaking ? s.iconBtnActive : {})}}
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(feedback.reply)}>
                    {isSpeaking ? '⏹ Stop' : '🔊 Replay'}
                  </button>
                )}
              </div>
              <p style={s.replyText}>{feedback.reply}</p>
              <button style={s.detailToggle} onClick={() => setShowScoreDetail(v => !v)}>
                {showScoreDetail ? 'Hide score breakdown ↑' : 'See score breakdown ↓'}
              </button>
            </div>

            {showScoreDetail && (
              <div style={s.card}>
                <div style={s.scoreRow}>
                  <span style={{...s.scoreBig, color: scoreColor(feedback.score)}}>{feedback.score}</span>
                  <span style={s.scoreOf}>/10</span>
                </div>
                <p style={s.feedbackText}>{feedback.feedback}</p>
                <div style={s.feedbackGrid}>
                  <div style={{...s.feedbackItem, borderLeft: '3px solid #7C3AED'}}>
                    <p style={s.feedbackItemLabel}>What you did well</p>
                    <p style={s.feedbackItemText}>{feedback.strong}</p>
                  </div>
                  <div style={{...s.feedbackItem, borderLeft: '3px solid #D97706'}}>
                    <p style={s.feedbackItemLabel}>Improve this</p>
                    <p style={s.feedbackItemText}>{feedback.improve}</p>
                  </div>
                </div>
              </div>
            )}

            <button style={s.primaryBtn} onClick={nextQuestion}>
              {questionNum >= totalQuestions ? 'See Final Results' : 'Next Question'}
            </button>
          </div>
        )}
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
  navMeta: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBadge: { fontSize: '11px', color: C.purpleMid, background: C.purpleLight, border: `1px solid ${C.purpleBorder}`, borderRadius: '6px', padding: '4px 12px', fontWeight: '600' },
  exitBtn: { fontSize: '12px', color: C.muted, background: 'none', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  logoutBtn: { fontSize: '12px', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '600' },
  main: { maxWidth: '700px', margin: '0 auto', padding: '44px 24px' },
  progressWrap: { marginBottom: '32px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressLabel: { fontSize: '12px', color: C.muted, fontWeight: '500' },
  progressTrack: { height: '4px', background: C.purpleLight, borderRadius: '4px' },
  progressFill: { height: '100%', background: C.purpleMid, borderRadius: '4px', transition: 'width 0.5s ease' },
  questionCard: { background: C.card, border: `2px solid ${C.purpleBorder}`, borderLeft: `4px solid ${C.purpleMid}`, borderRadius: '12px', padding: '28px 32px', marginBottom: '16px' },
  questionTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  questionEyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '2px', textTransform: 'uppercase' },
  questionText: { fontSize: '20px', fontWeight: '700', lineHeight: 1.55, color: C.text, fontFamily: "'Sora', sans-serif" },
  loadingText: { fontSize: '15px', color: C.muted, fontStyle: 'italic' },
  iconBtn: { fontSize: '12px', color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: '500' },
  iconBtnActive: { color: C.purpleMid, background: C.purpleLight, borderColor: C.purpleBorder },
  iconBtnRed: { color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' },
  speakingPill: { display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '11px', color: C.purpleMid, background: C.purpleLight, border: `1px solid ${C.purpleBorder}`, borderRadius: '20px', padding: '4px 12px', fontWeight: '600' },
  speakDot: { width: '6px', height: '6px', borderRadius: '50%', background: C.purpleMid, flexShrink: 0 },
  listeningPill: { display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '11px', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '20px', padding: '4px 12px', fontWeight: '600' },
  listenDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626', flexShrink: 0 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '28px 32px', marginBottom: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  cardLabel: { fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase' },
  textarea: { width: '100%', padding: '14px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, fontSize: '14px', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", marginBottom: '16px' },
  primaryBtn: { padding: '13px 28px', background: C.purpleMid, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Sora', sans-serif" },
  outlineBtn: { padding: '13px 28px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  replyCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px 28px', marginBottom: '16px' },
  replyHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: C.purpleMid, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 },
  avatarLabel: { fontSize: '12px', fontWeight: '700', color: C.purple, margin: 0 },
  replyText: { fontSize: '15px', lineHeight: 1.75, color: C.text, fontFamily: "'Sora', sans-serif", borderLeft: `3px solid ${C.purpleBorder}`, paddingLeft: '16px', margin: '0 0 16px' },
  detailToggle: { fontSize: '12px', color: C.purpleMid, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Inter', sans-serif", fontWeight: '700' },
  scoreRow: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' },
  scoreBig: { fontSize: '48px', fontWeight: '700', lineHeight: 1, fontFamily: "'Sora', sans-serif" },
  scoreOf: { fontSize: '20px', color: C.muted },
  feedbackText: { fontSize: '14px', color: C.muted, lineHeight: 1.7, marginBottom: '16px' },
  feedbackGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  feedbackItem: { background: C.bg, borderRadius: '8px', padding: '14px 16px' },
  feedbackItemLabel: { fontSize: '10px', fontWeight: '700', color: C.muted, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' },
  feedbackItemText: { fontSize: '13px', color: C.text, lineHeight: 1.6 },
  doneWrap: { maxWidth: '560px', margin: '0 auto', padding: '64px 24px' },
  eyebrow: { fontSize: '10px', fontWeight: '700', color: C.purpleMid, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' },
  doneHeading: { fontSize: '38px', fontWeight: '700', color: C.purple, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.5px', marginBottom: '24px' },
  bigScoreRow: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' },
  bigScoreNum: { fontSize: '72px', fontWeight: '700', lineHeight: 1, fontFamily: "'Sora', sans-serif" },
  bigScoreOf: { fontSize: '28px', color: C.muted },
  avgLabel: { fontSize: '13px', color: C.muted, marginBottom: '36px' },
  barList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  barLabel: { fontSize: '12px', color: C.muted, width: '24px' },
  barTrack: { flex: 1, height: '5px', background: C.purpleLight, borderRadius: '3px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px', transition: 'width 0.6s ease' },
  barNum: { fontSize: '12px', fontWeight: '700', width: '36px', textAlign: 'right' },
  doneBtns: { display: 'flex', gap: '12px' },
}