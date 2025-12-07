import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { Pool } = pg
const app = express()
const PORT = 3001

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.use(cors())
app.use(express.json())

app.post('/api/survey', async (req, res) => {
  try {
    const { answers, submittedAt, device, userAgent } = req.body

    const query = `
      INSERT INTO survey_responses (answers, submitted_at, device, user_agent)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `
    
    await pool.query(query, [JSON.stringify(answers), submittedAt, device, userAgent])
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/survey', async (req, res) => {
  try {
    const query = 'SELECT * FROM survey_responses ORDER BY submitted_at DESC'
    const result = await pool.query(query)
    
    const responses = result.rows.map(row => ({
      id: row.id,
      answers: row.answers,
      submittedAt: row.submitted_at,
      device: row.device,
      userAgent: row.user_agent
    }))

    res.status(200).json(responses)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/survey/:id', async (req, res) => {
  try {
    const { id } = req.params
    const query = 'DELETE FROM survey_responses WHERE id = $1'
    await pool.query(query, [id])
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})
