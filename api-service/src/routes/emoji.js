const router = require('express').Router()
const axios = require('axios')
const { body, validationResult } = require('express-validator')

const STOCKAGE_URL = process.env.STOCKAGE_URL


// === POST /emoji ===
router.post('/',
  body('emoji').notEmpty().withMessage('Veuillez remplir le champ "emoji".'),
  body('utilisateur').optional().isString(),
  body('message').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const response = await axios.post(`${STOCKAGE_URL}/emojis`, req.body)
      res.status(201).json(response.data)
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: 'Erreur serveur' })
    }
  }
)

// === GET /emoji/random ===
router.get('/random', async (req, res) => {
  try {
    const response = await axios.get(`${STOCKAGE_URL}/emojis/random`)
    res.json(response.data)
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Aucun emoji enregistré' })
    }
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// === GET /emoji/stats ===
router.get('/stats', async (req, res) => {
  try {
    const [emojis, stats, top] = await Promise.all([
      axios.get(`${STOCKAGE_URL}/emojis`),
      axios.get(`${STOCKAGE_URL}/stats`),
      axios.get(`${STOCKAGE_URL}/emojis/top`)
    ])

    res.json({
      total: emojis.data.length,
      top: top.data,
      stats: stats.data
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router