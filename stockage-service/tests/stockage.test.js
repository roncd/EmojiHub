const request = require('supertest')
const app = require('../src/app')
const pool = require('../src/db')

// Nettoie la DB avant chaque test
beforeEach(async () => {
  await pool.query('DELETE FROM stats')
  await pool.query('DELETE FROM emojis')
})

// Ferme la connexion après tous les tests
afterAll(async () => {
  await pool.end()
})

// === HEALTH CHECK ===
describe('GET /health', () => {
  test('retourne status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ status: 'Ok', service: 'stockage-service' })
  })
})

// === POST /emojis ===
describe('POST /emojis', () => {
  test('enregistre un emoji correctement', async () => {
    const res = await request(app)
      .post('/emojis')
      .send({ emoji: '😀', utilisateur: 'rosalie', message: 'test' })

    expect(res.statusCode).toBe(201)
    expect(res.body.emoji).toBe('😀')
    expect(res.body.utilisateur).toBe('rosalie')
    expect(res.body.id).toBeDefined()
  })

  test('refuse: emoji manquant', async () => {
    const res = await request(app)
      .post('/emojis')
      .send({ utilisateur: 'rosalie' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})

// === GET /emojis ===
describe('GET /emojis', () => {
  test('retourne la liste des emojis', async () => {
    await request(app)
      .post('/emojis')
      .send({ emoji: '😂', utilisateur: 'paul', message: 'haha' })

    const res = await request(app).get('/emojis')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  test('retourne tableau vide si aucun emoji', async () => {
    const res = await request(app).get('/emojis')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(0)
  })
})

// === GET /emojis/random ===
describe('GET /emojis/random', () => {
  test('retourne un emoji aléatoire', async () => {
    await request(app)
      .post('/emojis')
      .send({ emoji: '🔥', utilisateur: 'test', message: 'fire' })

    const res = await request(app).get('/emojis/random')
    expect(res.statusCode).toBe(200)
    expect(res.body.emoji).toBeDefined()
  })

  test('retourne 404 si aucun emoji', async () => {
    const res = await request(app).get('/emojis/random')
    expect(res.statusCode).toBe(404)
  })
})

// === GET /emojis/top ===
describe('GET /emojis/top', () => {
  test('retourne le top 10 des emojis', async () => {
    await request(app).post('/emojis').send({ emoji: '😀' })
    await request(app).post('/emojis').send({ emoji: '😀' })
    await request(app).post('/emojis').send({ emoji: '😂' })

    const res = await request(app).get('/emojis/top')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0].emoji).toBe('😀')  
    expect(Number(res.body[0].total)).toBe(2)
  })
})

// === PUT /stats/:emoji ===
describe('PUT /stats/:emoji', () => {
  const emoji = encodeURIComponent('😀')

  test('crée les stats d un emoji', async () => {
    const res = await request(app)
      .put(`/stats/${emoji}`)
      .send({ count: 10, score: 0.8 })
    expect(res.statusCode).toBe(200)
    expect(res.body.count).toBe(10)

  })

  test('met à jour les stats existantes', async () => {
    await request(app).put(`/stats/${emoji}`).send({ count: 10, score: 0.8 })
    const res = await request(app).put(`/stats/${emoji}`).send({ count: 25, score: 0.9 })
    expect(res.statusCode).toBe(200)
    expect(res.body.count).toBe(25)
  })

  test('refuse si body manquant', async () => {
    const res = await request(app).put(`/stats/${emoji}`).send({})
    expect(res.statusCode).toBe(400)
  })

  test('refuse si types incorrects', async () => {
    const res = await request(app)
      .put(`/stats/${emoji}`)
      .send({ count: 'dix', score: 'haut' })
    expect(res.statusCode).toBe(400)
  })
})

// === GET /stats ===
describe('GET /stats', () => {
  test('retourne les stats', async () => {
    const emoji = encodeURIComponent('😀')
    await request(app).put(`/stats/${emoji}`).send({ count: 10, score: 0.8 })
    const res = await request(app).get('/stats')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
  })
   test('retourne tableau vide si aucune stats', async () => {
    const res = await request(app).get('/stats')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(0)
  })
})

// === DELETE /stats/:emoji ===
describe('DELETE /stats/:emoji', () => {
  test('supprime les stats 1 emoji', async () => {
    const emoji = encodeURIComponent('😀')
    await request(app).put(`/stats/${emoji}`).send({ count: 10, score: 0.8 })
    const res = await request(app).delete(`/stats/${emoji}`)
    expect(res.statusCode).toBe(200)
    const check = await request(app).get('/stats')
    expect(check.body.length).toBe(0)
  })
})


// === DELETE /emojis/:id ===
describe('DELETE /emojis/:id', () => {
  test('supprime 1 emoji', async () => {
    const id = ('1')
    await request(app).post(`/emojis/${id}`).send({ emoji: '😂' })

    const res = await request(app).delete(`/emojis/${id}`)
    expect(res.statusCode).toBe(200)
    const check = await request(app).get('/emojis')
    expect(check.body.length).toBe(0)
  })
})