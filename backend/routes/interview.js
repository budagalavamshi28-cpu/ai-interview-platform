const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/question', async (req, res) => {
  try {
    const { role, type, previousQuestions } = req.body;

    let typeInstruction = '';
    if (type === 'Technical') {
      typeInstruction = 'Ask a focused technical question about a concept, how something works, or a coding approach. One sentence only.';
    } else if (type === 'Behavioral') {
      typeInstruction = 'Ask a short behavioral question starting with "Tell me about a time..." or "How do you handle...". One sentence only.';
    } else if (type === 'HR') {
      typeInstruction = 'Ask a classic HR interview question about the candidate\'s background, personality, motivation, career goals, or work style. Examples: "Tell me about yourself.", "Why do you want to work here?", "Where do you see yourself in 5 years?", "What are your greatest strengths and weaknesses?", "Why are you leaving your current job?", "What motivates you?". One sentence only. Keep it natural and conversational.';
    } else if (type === 'Domain') {
      typeInstruction = 'Ask about tools, workflows, or best practices specific to this role. One sentence only.';
    } else {
      typeInstruction = 'Ask a short conversational question mixing technical, behavioral, or HR style like a real interviewer. One sentence only.';
    }

    const prompt = `You are a professional interviewer conducting a ${type} interview for a ${role} role.

${typeInstruction}

Rules:
- ONE sentence maximum
- Natural conversational tone
- No bullet points or sub-questions
- Sound like a real human interviewer
${previousQuestions?.length ? `- Already asked: ${previousQuestions.slice(-3).join(' | ')}. Ask something completely new and different.` : ''}

Return ONLY the question, nothing else.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 80,
    });

    res.json({ question: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error('QUESTION ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
    const { question, answer, role, type } = req.body;

    const isHR = type === 'HR';

    const prompt = `You are a ${isHR ? 'friendly HR Manager' : 'professional technical interviewer'} conducting a ${role} interview.

Question you asked: ${question}
Candidate's answer: ${answer}

${isHR
  ? 'Evaluate based on clarity, confidence, professionalism, and how well they presented themselves. Be warm and encouraging like a real HR person.'
  : 'Evaluate based on technical accuracy, depth, and clarity.'}

Respond in this exact JSON format:
{
  "reply": "<natural ${isHR ? 'HR manager' : 'interviewer'} response, 1-2 sentences, acknowledge what they said warmly>",
  "score": <1-10>,
  "feedback": "<2 sentences of specific actionable feedback>",
  "strong": "<one thing they did well>",
  "improve": "<one concrete thing to improve>"
}
Return ONLY the JSON, nothing else.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 350,
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error('EVALUATE ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;