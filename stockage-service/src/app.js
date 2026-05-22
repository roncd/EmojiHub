const express = require('express')
const morgan = require('morgan')
const pool = require('./db')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(morgan('dev'))

/* === CREATE ===*/
// (POST /emojis : ajouter un emoji)
app.post('/emojis', async (req, res) => {
    const { emoji, utilisateur, message } = req.body

    if (!emoji) {
        return res.status(400).json({ error: 'Veuillez remplir le champ "emoji".' })
    }

    try {
        const result = await pool.query('INSERT INTO emojis (emoji, utilisateur, message) VALUES ($1, $2, $3) RETURNING *',
            [emoji, utilisateur, message]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

/* === READ ===*/
// (GET /emojis : voir tous les emojis)
app.get('/emojis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM emojis ORDER BY created DESC'
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// (GET /emojis/random : voir 1 emoji aléatoirement)
app.get('/emojis/random', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM emojis ORDER BY RANDOM() LIMIT 1'
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aucun emoji enregistré' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// (GET /emojis/top : voir le top 10 emojis)
app.get('/emojis/top', async (req, res) => {
    try {
        const result = await pool.query('SELECT emoji, COUNT(*) as total FROM emojis GROUP BY emoji ORDER BY total DESC LIMIT 10'
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aucun emoji enregistré' })
        }
        res.json(result.rows)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// (GET /stats : voir les stats analyse-service)
app.get('/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stats ORDER BY count DESC'
        )
        res.json(result.rows)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

/* === UPDATE ===*/
// (PUT /stats/emoji : modifié stats emoji)
app.put('/stats/:emoji', async (req, res) => {
    const { emoji } = req.params
    const { count, score } = req.body

    if (count === undefined || score === undefined) {
        return res.status(400).json({ error: 'Veuillez remplir les champs "Score" et "Count".' })
    }

    if (typeof count !== 'number' || typeof score !== 'number') {
        return res.status(400).json({ error: 'count et score doivent être des nombres' })
    }

    try {
        const result = await pool.query(`INSERT INTO stats (emoji, count, score, updated) 
            VALUES ($1, $2, $3, NOW()) 
            ON CONFLICT (emoji) 
            DO UPDATE SET count = $2, score = $3, updated = NOW() RETURNING *`,
            [emoji, count, score])
        res.json(result.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

/* === DELETE ===*/
// (DELETE /stats : supprimer 1 stats d'emoji)
app.delete('/stats/:emoji', async (req, res) => {
    const { emoji } = req.params

    try {
        await pool.query('DELETE FROM stats WHERE emoji = $1', [emoji])
        res.json({ message: `Stats avec ${emoji} a été supprimé.` })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// (DELETE /emojis : supprimer 1 emoji)
app.delete('/emojis/:id', async (req, res) => {
    const { id } = req.params

    try {
        await pool.query('DELETE FROM emojis WHERE id = $1', [id])
        res.json({ message: `Emoji ${id} a été supprimé.` })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

//* === HEALTH CHECK ===*/
app.get('/health', (req, res) => {
    res.json({ status: 'Ok', service: 'stockage-service' })
})

module.exports = app