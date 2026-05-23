/**
 * Tests unitaires pour la logique d'analyse
 * On teste les fonctions pures sans appel HTTP
 */

// ── Reproduire la logique testable ────────────
const EMOJI_SCORES = {
  '😀': 2, '😄': 2, '🥰': 3, '🎉': 3, '❤️': 3,
  '😢': -2, '😭': -3, '😠': -3, '💔': -3,
}

function getScore(emoji) {
  return EMOJI_SCORES[emoji] ?? 0
}

function calcFrequences(emojis) {
  const freq = {}
  for (const row of emojis) {
    freq[row.emoji] = (freq[row.emoji] || 0) + 1
  }
  return freq
}

function calcScores(frequences) {
  const scores = {}
  for (const [emoji, count] of Object.entries(frequences)) {
    scores[emoji] = getScore(emoji) * count
  }
  return scores
}

function getTopEmoji(frequences) {
  const entries = Object.entries(frequences)
  if (entries.length === 0) return null
  return entries.sort((a, b) => b[1] - a[1])[0]
}

function calcScoreGlobal(scores) {
  return Object.values(scores).reduce((a, b) => a + b, 0)
}

// ── Tests ─────────────────────────────────────
describe('calcFrequences', () => {
  test('compte correctement les emojis', () => {
    const emojis = [
      { emoji: '😀' }, { emoji: '😀' }, { emoji: '😢' }
    ]
    const freq = calcFrequences(emojis)
    expect(freq['😀']).toBe(2)
    expect(freq['😢']).toBe(1)
  })

  test('retourne un objet vide si aucun emoji', () => {
    expect(calcFrequences([])).toEqual({})
  })
})

describe('getScore', () => {
  test('retourne le bon score pour un emoji positif', () => {
    expect(getScore('😀')).toBe(2)
    expect(getScore('🥰')).toBe(3)
  })

  test('retourne le bon score pour un emoji négatif', () => {
    expect(getScore('😢')).toBe(-2)
    expect(getScore('😭')).toBe(-3)
  })

  test('retourne 0 pour un emoji inconnu', () => {
    expect(getScore('🦄')).toBe(0)
    expect(getScore('🍕')).toBe(0)
  })
})

describe('calcScores', () => {
  test('multiplie le score par la fréquence', () => {
    const freq = { '😀': 3, '😢': 2 }
    const scores = calcScores(freq)
    expect(scores['😀']).toBe(6)   // 2 * 3
    expect(scores['😢']).toBe(-4)  // -2 * 2
  })

  test('score 0 pour emoji inconnu', () => {
    const freq = { '🦄': 5 }
    const scores = calcScores(freq)
    expect(scores['🦄']).toBe(0)
  })
})

describe('getTopEmoji', () => {
  test('retourne l\'emoji le plus fréquent', () => {
    const freq = { '😀': 10, '😢': 3, '🎉': 7 }
    const top = getTopEmoji(freq)
    expect(top[0]).toBe('😀')
    expect(top[1]).toBe(10)
  })

  test('retourne null si aucun emoji', () => {
    expect(getTopEmoji({})).toBeNull()
  })
})

describe('calcScoreGlobal', () => {
  test('somme correctement les scores', () => {
    const scores = { '😀': 6, '😢': -4, '🎉': 9 }
    expect(calcScoreGlobal(scores)).toBe(11)
  })

  test('score global négatif si beaucoup d\'emojis tristes', () => {
    const scores = { '😭': -9, '😠': -6 }
    expect(calcScoreGlobal(scores)).toBe(-15)
  })

  test('retourne 0 si aucun score', () => {
    expect(calcScoreGlobal({})).toBe(0)
  })
})