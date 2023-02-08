import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { faker } from '@faker-js/faker/locale/en'

dotenv.config()
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.post('/signup', async (req, res) => {
  const { token } = req.body
  const secret = process.env.hcaptchaSecret
  const verifyUrl = 'https://hcaptcha.com/siteverify'
  if (!token) {
    return res.status(400).json({ error: 'Token is missing' })
  }

  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)

  const response = await fetch(verifyUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  const json = await response.json()
  const { success } = json
  if (success) {
    return res.json({ success: true })
  }
  return res.status(400).json({ error: res.error })
})

app.get('/generate', (req, res) => {
  const randomName = faker.name.findName()
  console.log(randomName)
  const randomEmail = faker.internet.email()
  const randomPassword = faker.internet.password()
  const getRandomInt = max => Math.floor(Math.random() * max)
  const randomPlanet = ['Mars', 'Jupiter', 'Uranus'][getRandomInt(3)]
  return res.json({ randomName, randomEmail, randomPassword, randomPlanet })
})

app.get('/test', (req, res) => {
    return res.json({"something": "oh noes!"})
  })
  

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`)
})
