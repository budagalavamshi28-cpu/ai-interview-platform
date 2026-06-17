require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [{ role: 'user', content: 'Say hello' }],
  max_tokens: 50,
})
.then(r => console.log('SUCCESS:', r.choices[0].message.content))
.catch(e => console.error('ERROR:', e.message));