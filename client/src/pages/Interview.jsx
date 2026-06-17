import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Interview() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questionNum, setQuestionNum] = useState(1)
  const [previousQuestions, setPreviousQuestions] = useState([])
  const [scores, setScores] = useState([])
  const [phase, setPhase] = useState('question') // question | feedback | done

  const location = useLocation()
  const navigate = useNavigate()
  const { role, type } = location.state || { role: 'Full Stack', type: 'Technical' }

  const totalQuestions = 5

  useEffect(() => {
    generateQuestion()
  }, [])

  const generateQuestion = async () => {
    setLoading(true)
    setAnswer('')
    setFeedback(null)
    setPhase('question')
    try {
      const res = await axios.post('http://localhost:5000/api/interview/question', {
        role, type, previousQuestions
      })
      setQuestion(res.data.question)
      setPreviousQuestions(prev => [...prev, res.data.question])
    } catch (err) {
      alert('Failed to generate question: ' + (err.response?.data?.message || err.message))
    }
    setLoading(false)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/interview/evaluate', {
        question, answer, role
      })
      setFeedback(res.data)
      setScores(prev => [...prev, res.data.score])
      setPhase('feedback')
    } catch (err) {
      alert('Failed to evaluate answer.')
    }
    setLoading(false)
  }

  const nextQuestion = () => {
    if (questionNum >= totalQuestions) {
      setPhase('done')
    } else {
      setQuestionNum(prev => prev + 1)
      generateQuestion()
    }
  }

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  if (phase === 'done') {
    return (
      <div style={s.page}>
        <nav style={s.nav}>
          <span style={s.logo}>InterviewIQ</span>
        </nav>
        <div style={s.doneContainer}>
          <p style={s.tag}>Session complete</p>
          <h1 style={s.doneTitle}>Your results</h1>
          <div style={s.scoreBox}>
            <span style={s.bigScore}>{avgScore}</span>
            <span style={s.scoreLabel}>/ 10 average score</span>
          </div>
          <div style={s.scoreList}>
            {scores.map((score, i) => (
              <div key={i} style={s.scoreRow}>
                <span style={s.scoreRowLabel}>Question {i + 1}</span>
                <div style={s.scoreBar}>
                  <div style={{...s.scoreBarFill, width: `${score * 10}%`, background: score >= 7 ? '#16a34a' : score >= 5 ? '#ca8a04' : '#dc2626'}} />
                </div>
                <span style={s.scoreRowNum}>{score}/10</span>
              </div>
            ))}
          </div>
          <div style={s.doneButtons}>
            <button style={s.primaryBtn} onClick={() => navigate('/dashboard')}>Back to dashboard</button>
            <button style={s.secondaryBtn} onClick={() => { setQuestionNum(1); setScores([]); setPreviousQuestions([]); generateQuestion(); }}>Try again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>InterviewIQ</span>
        <div style={s.navRight}>
          <span style={s.navInfo}>{role} — {type}</span>
          <button style={s.exitBtn} onClick={() => navigate('/dashboard')}>Exit</button>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.progress}>
          <div style={s.progressHeader}>
            <span style={s.progressLabel}>Question {questionNum} of {totalQuestions}</span>
            <span style={s.progressLabel}>{Math.round((questionNum - 1) / totalQuestions * 100)}% complete</span>
          </div>
          <div style={s.progressBar}>
            <div style={{...s.progressFill, width: `${((questionNum - 1) / totalQuestions) * 100}%`}} />
          </div>
        </div>

        <div style={s.questionBox}>
          <p style={s.questionTag}>Question {questionNum}</p>
          {loading && !question ? (
            <p style={s.loadingText}>Generating question...</p>
          ) : (
            <p style={s.questionText}>{question}</p>
          )}
        </div>

        {phase === 'question' && (
          <div style={s.answerBox}>
            <label style={s.answerLabel}>Your answer</label>
            <textarea
              style={s.textarea}
              placeholder="Type your answer here. Be as detailed as possible..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
            />
            <button
              style={{...s.primaryBtn, opacity: loading || !answer.trim() ? 0.5 : 1}}
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
            >
              {loading ? 'Evaluating...' : 'Submit answer →'}
            </button>
          </div>
        )}

        {phase === 'feedback' && feedback && (
          <div style={s.feedbackBox}>
            <div style={s.scoreRow2}>
              <span style={s.feedbackScore}>{feedback.score}</span>
              <span style={s.feedbackScoreLabel}>/10</span>
            </div>

            <div style={s.feedbackGrid}>
              <div style={{...s.feedbackCard, borderLeft: '3px solid #16a34a'}}>
                <p style={s.feedbackCardLabel}>What you did well</p>
                <p style={s.feedbackCardText}>{feedback.strong}</p>
              </div>
              <div style={{...s.feedbackCard, borderLeft: '3px solid #ca8a04'}}>
                <p style={s.feedbackCardLabel}>What to improve</p>
                <p style={s.feedbackCardText}>{feedback.improve}</p>
              </div>
            </div>

            <div style={s.feedbackMain}>
              <p style={s.feedbackCardLabel}>Detailed feedback</p>
              <p style={s.feedbackCardText}>{feedback.feedback}</p>
            </div>

            <button style={s.primaryBtn} onClick={nextQuestion}>
              {questionNum >= totalQuestions ? 'See results →' : 'Next question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f0', color: '#111', fontFamily: "'Inter', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 56px', background: '#fff', borderBottom: '1px solid #e8e8e8' },
  logo: { fontSize: '16px', fontWeight: '700', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  navInfo: { fontSize: '13px', color: '#888' },
  exitBtn: { fontSize: '13px', color: '#111', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: '500' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '48px 56px' },
  progress: { marginBottom: '36px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  progressLabel: { fontSize: '12px', color: '#888', fontWeight: '500' },
  progressBar: { height: '4px', background: '#e8e8e8', borderRadius: '4px' },
  progressFill: { height: '100%', background: '#111', borderRadius: '4px', transition: 'width 0.3s' },
  questionBox: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '32px', marginBottom: '24px' },
  questionTag: { fontSize: '11px', fontWeight: '700', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' },
  questionText: { fontSize: '18px', fontWeight: '600', lineHeight: 1.6, color: '#111' },
  loadingText: { fontSize: '15px', color: '#888' },
  answerBox: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '32px' },
  answerLabel: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#444', marginBottom: '12px', letterSpacing: '0.3px' },
  textarea: { width: '100%', padding: '14px', background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: '8px', color: '#111', fontSize: '14px', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", marginBottom: '20px' },
  primaryBtn: { padding: '13px 24px', background: '#111', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { padding: '13px 24px', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', color: '#111', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  feedbackBox: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '32px' },
  scoreRow2: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' },
  feedbackScore: { fontSize: '48px', fontWeight: '800', color: '#111' },
  feedbackScoreLabel: { fontSize: '20px', color: '#888' },
  feedbackGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  feedbackCard: { background: '#fafafa', borderRadius: '8px', padding: '16px' },
  feedbackCardLabel: { fontSize: '11px', fontWeight: '700', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
  feedbackCardText: { fontSize: '14px', color: '#444', lineHeight: 1.6 },
  feedbackMain: { background: '#fafafa', borderRadius: '8px', padding: '16px', marginBottom: '24px' },
  doneContainer: { maxWidth: '600px', margin: '0 auto', padding: '64px 56px' },
  tag: { fontSize: '12px', fontWeight: '600', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' },
  doneTitle: { fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '36px' },
  scoreBox: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '36px' },
  bigScore: { fontSize: '72px', fontWeight: '800', color: '#111' },
  scoreLabel: { fontSize: '20px', color: '#888' },
  scoreList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  scoreRowLabel: { fontSize: '13px', color: '#888', width: '80px' },
  scoreBar: { flex: 1, height: '6px', background: '#e8e8e8', borderRadius: '4px', overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  scoreRowNum: { fontSize: '13px', fontWeight: '600', color: '#111', width: '40px', textAlign: 'right' },
  doneButtons: { display: 'flex', gap: '12px' },
}