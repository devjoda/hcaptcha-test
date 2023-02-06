require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { verify } = require("hcaptcha");

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.post("/signup", async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).json({ error: "Token is missing" });
    }

    try {
        let { success } = await verify(
            process.env.hcaptchaSecret,
            req.body.token
        );
        if (success) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ error: "Invalid Captcha" });
        }
    } catch (e) {
        return res.status(400).json({ error: "Captcha Error. Try again." });
    }
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${ PORT }...`)
})
