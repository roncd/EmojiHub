require('dotenv').config();
const axios = require('axios')

const STOCKAGE_URL = process.env.STOCKAGE_URL || 'http://stockage-service:5001'
const INTERVAL_MS  = parseInt(process.env.ANALYSE_INTERVAL_MS || '60000') // 1 min par défaut

// ─────────────────────────────────────────────
// Score Happy/Sad par emoji
// ─────────────────────────────────────────────
const EMOJI_SCORES = {
  // Positifs
  '😀': 2, '😄': 2, '😁': 2, '🥰': 3, '😍': 3, '🤩': 3,
  '😊': 2, '🙂': 1, '😎': 2, '🥳': 3, '🎉': 3, '🎊': 3,
  '❤️': 3, '💕': 3, '💖': 3, '👍': 1, '🙌': 2, '🔥': 2,
  '✨': 2, '🌟': 2, '⭐': 1, '🚀': 2, '💪': 2, '😂': 2,
  '🤣': 2, '😆': 2, '😋': 1, '🤗': 2, '😇': 2, '🌈': 2,
  // Négatifs
  '😢': -2, '😭': -3, '😞': -2, '😔': -2, '😟': -2,
  '😠': -3, '😡': -3, '🤬': -3, '😤': -2, '💔': -3,
  '😰': -2, '😨': -2, '😱': -3, '🤯': -1, '😩': -2,
  '😫': -2, '🥺': -1, '😒': -1, '🙄': -1, '😑': -1,
}

function getScore(emoji) {
  return EMOJI_SCORES[emoji] ?? 0
}

// ─────────────────────────────────────────────
// Analyse principale
// ─────────────────────────────────────────────
async function runAnalyse() {
  console.log(`[${new Date().toISOString()}] 🔍 Lancement de l'analyse...`)

  let emojis
  try {
    const res = await axios.get(`${STOCKAGE_URL}/emojis`)
    emojis = res.data
  } catch (err) {
    console.error('❌ Impossible de lire les emojis:', err.message)
    return
  }

  if (!emojis || emojis.length === 0) {
    console.log('ℹ️  Aucun emoji en base, analyse ignorée.')
    return
  }

  // ── 1. Compter les fréquences par emoji ──────
  const frequences = {}
  for (const row of emojis) {
    const e = row.emoji
    frequences[e] = (frequences[e] || 0) + 1
  }

  // ── 2. Calculer le score Happy/Sad par emoji ─
  const scores = {}
  for (const [emoji, count] of Object.entries(frequences)) {
    scores[emoji] = getScore(emoji) * count
  }

  // ── 3. Emoji le plus utilisé ─────────────────
  const topEmoji = Object.entries(frequences)
    .sort((a, b) => b[1] - a[1])[0]

  // ── 4. Fréquences par heure (dernières 24h) ──
  const parHeure = {}
  const maintenant = new Date()
  for (const row of emojis) {
    const created = new Date(row.created)
    const diffH = (maintenant - created) / 3600000
    if (diffH <= 24) {
      const heure = created.getHours()
      parHeure[heure] = (parHeure[heure] || 0) + 1
    }
  }

  // ── 5. Logs résumé ────────────────────────────
  console.log(`📊 Total emojis    : ${emojis.length}`)
  console.log(`🏆 Top emoji       : ${topEmoji[0]} (${topEmoji[1]} fois)`)
  console.log(`😊 Score global    : ${Object.values(scores).reduce((a, b) => a + b, 0)}`)
  console.log(`🕐 Actifs (24h)    : ${Object.values(parHeure).reduce((a, b) => a + b, 0)}`)

  // ── 6. Mettre à jour la table stats ──────────
  let ok = 0, err = 0
  for (const [emoji, count] of Object.entries(frequences)) {
    const score = scores[emoji] || 0
    try {
      await axios.put(`${STOCKAGE_URL}/stats/${encodeURIComponent(emoji)}`, {
        count,
        score,
      })
      ok++
    } catch (e) {
      console.error(`❌ Erreur PUT stats pour ${emoji}:`, e.message)
      err++
    }
  }

  console.log(`Stats mises à jour : ${ok} ok, ${err} erreurs`)
  console.log(`─────────────────────────────────────────`)
}

// ─────────────────────────────────────────────
// Lancement avec retry au démarrage
// ─────────────────────────────────────────────
async function startWithRetry(retries = 5, delayMs = 5000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await axios.get(`${STOCKAGE_URL}/health`)
      console.log('Stockage-service accessible, démarrage de l\'analyse.')
      return true
    } catch {
      console.log(`Attente stockage-service... (${i}/${retries})`)
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  console.error('❌ Stockage-service inaccessible après plusieurs tentatives.')
  return false
}

async function main() {
  console.log(' Analyse-service démarré')
  console.log(`   STOCKAGE_URL  : ${STOCKAGE_URL}`)
  console.log(`   Intervalle    : ${INTERVAL_MS / 1000}s`)

  const ready = await startWithRetry()
  if (!ready) process.exit(1)

  // Première analyse immédiate
  await runAnalyse()

  // Puis toutes les X minutes
  setInterval(runAnalyse, INTERVAL_MS)
}

main()