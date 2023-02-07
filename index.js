import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();
const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
  const { token } = req.body;
  const secret = process.env.hcaptchaSecret;
  const verifyUrl = 'https://hcaptcha.com/siteverify';
  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);

  const response = await fetch(verifyUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  const { success } = json;
  if (success) {
    return res.json({ success: true });
  }
  return res.status(400).json({ error: res.error.data.response });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
