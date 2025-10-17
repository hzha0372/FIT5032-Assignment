import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3000

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.use(cors())
app.use(bodyParser.json())

app.post('/send-code', async (req, res) => {
  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required.' })
  }

  const msg = {
    to: email,
    from: '815325776@qq.com',
    subject: 'Your verification code',
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  }

  try {
    await sgMail.send(msg)
    console.log(`Verification code sent to ${email}`)
    res.json({ message: 'Verification code sent successfully.' })
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error)
    res.status(500).json({ message: 'Failed to send verification email.' })
  }
})

app.get('/', (req, res) => {
  res.send('Hello from Node.js!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
