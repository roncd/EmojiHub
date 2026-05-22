const router = require('express').Router()
const axios = require('axios')

const STOCKAGE_URL = process.env.STOCKAGE_URL

// === GET/metrics (monitoring) ===
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${STOCKAGE_URL}/emojis`)
    res.json({
      service: 'api-service',
      total_emojis: response.data.length,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router