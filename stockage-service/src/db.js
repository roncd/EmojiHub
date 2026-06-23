// Connexion database
require('dotenv').config();
const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

// Test la connexion 
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur connexion PostgreSQL:', err.message)
  } else {
    console.log('Connexion à la base de donnée réussi.')
    release()
  }
})

module.exports = pool