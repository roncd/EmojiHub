require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`stockage-service a démarré sur le port: ${PORT}`)
})