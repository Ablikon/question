import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { answers, submittedAt, device, userAgent } = req.body

      console.log('Received data:', { answers, submittedAt, device, userAgent })

      const query = `
        INSERT INTO survey_responses (answers, submitted_at, device, user_agent)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `
      
      const result = await pool.query(query, [JSON.stringify(answers), submittedAt, device || 'Unknown', userAgent || ''])
      
      console.log('Insert successful:', result.rows[0])
      
      return res.status(200).json({ success: true, id: result.rows[0].id })
    }

    if (req.method === 'GET') {
      const query = 'SELECT * FROM survey_responses ORDER BY submitted_at DESC'
      const result = await pool.query(query)
      
      const responses = result.rows.map(row => ({
        id: row.id,
        answers: row.answers,
        submittedAt: row.submitted_at,
        device: row.device,
        userAgent: row.user_agent
      }))

      return res.status(200).json(responses)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Database error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    })
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      detail: error.detail || 'Check server logs'
    })
  }
}
