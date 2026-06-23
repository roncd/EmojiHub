require('dotenv').config();
const app = require('./app');
const pool = require('./db');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;

async function start() {
  try {
    // Exécute la migration SQL au démarrage
    const sql = fs.readFileSync(path.join(__dirname, '../migration/init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration exécutée.');

    app.listen(PORT, () => {
      console.log(`stockage-service a démarré sur le port: ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur au démarrage:', err.message);
    process.exit(1);
  }
}

start();