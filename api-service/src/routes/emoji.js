const router = require('express').Router()
const axios = require('axios')
const { body, validationResult } = require('express-validator')

const STOCKAGE_URL = process.env.STOCKAGE_URL

/**
 * @swagger
 * tags:
 *   name: Emoji
 *   description: Endpoints liés aux emojis
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmojiInput:
 *       type: object
 *       required:
 *         - emoji
 *       properties:
 *         emoji:
 *           type: string
 *           example: "😂"
 *         utilisateur:
 *           type: string
 *           example: "rosalie"
 *         message:
 *           type: string
 *           example: "trop drôle !"
 *
 *     EmojiResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 42
 *         emoji:
 *           type: string
 *           example: "😂"
 *         utilisateur:
 *           type: string
 *           example: "rosalie"
 *         message:
 *           type: string
 *           example: "trop drôle !"
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /emoji:
 *   post:
 *     summary: Enregistre un emoji
 *     tags: [Emoji]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmojiInput'
 *     responses:
 *       201:
 *         description: Emoji enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmojiResponse'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

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
      console.error(err.code)
      res.status(500).json({ error: 'Erreur serveur' })
    }
  }
)

/**
 * @swagger
 * /emoji/random:
 *   get:
 *     summary: Renvoie un emoji aléatoire
 *     tags: [Emoji]
 *     responses:
 *       200:
 *         description: Emoji aléatoire renvoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emoji:
 *                   type: string
 *                   example: "🔥"
 *       404:
 *         description: Aucun emoji enregistré
 *       500:
 *         description: Erreur serveur
 */

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

/**
 * @swagger
 * /emoji/stats:
 *   get:
 *     summary: Renvoie les statistiques globales des emojis
 *     tags: [Emoji]
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 152
 *                 top:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       emoji:
 *                         type: string
 *                         example: "😂"
 *                       count:
 *                         type: integer
 *                         example: 42
 *                 stats:
 *                   type: object
 *                   example:
 *                     happy_sad_score: 0.78
 *                     frequences_per_hour:
 *                       "14": 12
 *                       "15": 20
 *       500:
 *         description: Erreur serveur
 */

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
    console.error(err.code)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router