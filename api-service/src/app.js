require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const emojiRoutes = require('./routes/emoji')
const metricsRoutes = require('./routes/metrics')


const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// === ROUTES ===
app.use('/emoji', emojiRoutes)
app.use('/metrics', metricsRoutes)

app.get("/", (req, res) => {
  res.json({ message: "EmojiHub API is running" });
});

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'Ok', service: 'api-service' })
})

module.exports = app