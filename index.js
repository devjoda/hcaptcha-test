require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const fetch = require('node-fetch')
const { verify } = require("hcaptcha");

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.post("/signup", async (req, res, next) => {
    // const token = req.body['h-captcha-response'];
    const token = req.body.token;
    const secret = process.env.hcaptchaSecret;
    const verifyUrl = 'https://hcaptcha.com/siteverify';
    if (!token) {
        return res.status(400).json({ error: "Token is missing" });
    }

    try {
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
        } else {
            return res.status(400).json({ error: "Invalid Captcha" });
        }
    } catch (e) {
        return res.status(400).json({ error: e.response });
    }
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${ PORT }...`)
})
