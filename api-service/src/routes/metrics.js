const router = require('express').Router()
const axios = require('axios')

const STOCKAGE_URL = process.env.STOCKAGE_URL

/**
 * @swagger
 * tags:
 *   name: Monitoring
 *   description: Endpoints de monitoring et métriques
 */

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Renvoie les métriques du service API
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Métriques du service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: "api-service"
 *                 total_emojis:
 *                   type: integer
 *                   example: 152
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erreur serveur
 */

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