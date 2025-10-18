// functions/index.js
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import cors from 'cors'

admin.initializeApp()
const db = admin.firestore()
const corsHandler = cors({ origin: true })

// ---------------- Programs ----------------

// Get all programs
export const getPrograms = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const snapshot = await db.collection('programs').get()
      const programs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.status(200).json(programs)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })
})

// Add a new program
export const addProgram = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
      }
      const data = req.body
      if (!data.name) return res.status(400).json({ error: 'Program Name required' })
      const docRef = await db.collection('programs').add(data)
      res.status(200).json({ id: docRef.id, ...data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })
})

// ---------------- Feedback ----------------

// Get all feedbacks
export const getFeedbacks = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const snapshot = await db.collection('feedbacks').get()
      const feedbacks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.status(200).json(feedbacks)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })
})

// Add new feedback
export const addFeedback = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
      }
      const data = req.body
      if (!data.participantName || !data.programName)
        return res.status(400).json({ error: 'Name and Program required' })
      const docRef = await db.collection('feedbacks').add(data)
      res.status(200).json({ id: docRef.id, ...data })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })
})
