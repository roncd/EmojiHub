require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const emojiRoutes = require('./routes/emoji')
const metricsRoutes = require('./routes/metrics')


const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// === ROUTES ===
app.use('/emoji', emojiRoutes)
app.use('/metrics', metricsRoutes)

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'Ok', service: 'api-service' })
})

app.listen(PORT, () => {
  console.log(`api-service a démarré sur le port:  ${PORT}`)
})

module.exports = app