const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/question', async (req, res) => {
  try {
    const { role, type, previousQuestions } = req.body;

    const prompt = `You are a professional technical interviewer.
Generate 1 interview question for a ${role} position.
Interview type: ${type}.
${previousQuestions?.length ? `Already asked: ${previousQuestions.join(', ')}. Ask something different.` : ''}
Return ONLY the question, nothing else.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    const question = response.choices[0].message.content;
    res.json({ question });
  } catch (err) {
    console.error('QUESTION ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    const prompt = `You are a professional interviewer evaluating a candidate for a ${role} position.

Question: ${question}
Candidate's answer: ${answer}

Evaluate the answer and respond in this exact JSON format:
{
  "score": <number from 1 to 10>,
  "feedback": "<2-3 sentences of specific feedback>",
  "strong": "<what they did well in one sentence>",
  "improve": "<what they should improve in one sentence>"
}
Return ONLY the JSON, nothing else.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('EVALUATE ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;