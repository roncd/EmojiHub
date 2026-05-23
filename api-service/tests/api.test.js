const request = require('supertest')
const app = require('../src/app')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mock = new MockAdapter(axios)
const STOCKAGE_URL = process.env.STOCKAGE_URL

// Réinitialise les mocks après chaque test
afterEach(() => {
  mock.reset()
})

// === HEALTH CHECK ===
describe('GET /health', () => {
  test('retourne status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ status: 'Ok', service: 'api-service' })
  })
})

// === POST /emoji ===
describe('POST /emoji', () => {
  test('enregistre un emoji correctement', async () => {
    mock.onPost(`${STOCKAGE_URL}/emojis`).reply(201, {
      id: 1,
      emoji: '😀',
      utilisateur: 'rosalie',
      message: 'test'
    })

    const res = await request(app)
      .post('/emoji')
      .send({ emoji: '😀', utilisateur: 'rosalie', message: 'test' })

    expect(res.statusCode).toBe(201)
    expect(res.body.emoji).toBe('😀')
    expect(res.body.id).toBeDefined()
  })

  test('refuse si emoji manquant', async () => {
    const res = await request(app)
      .post('/emoji')
      .send({ utilisateur: 'rosalie' })

    expect(res.statusCode).toBe(400)
    expect(res.body.errors).toBeDefined()
  })

  test('retourne 500 si stockage-service indisponible', async () => {
    mock.onPost(`${STOCKAGE_URL}/emojis`).networkError()

    const res = await request(app)
      .post('/emoji')
      .send({ emoji: '😀' })

    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('Erreur serveur')
  })
})

// === GET /emoji/random ===
describe('GET /emoji/random', () => {
  test('retourne un emoji aléatoire', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis/random`).reply(200, {
      id: 1,
      emoji: '😂',
      utilisateur: 'paul',
      message: 'haha'
    })

    const res = await request(app).get('/emoji/random')
    expect(res.statusCode).toBe(200)
    expect(res.body.emoji).toBe('😂')
  })

  test('retourne 404 si aucun emoji', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis/random`).reply(404, {
      error: 'Aucun emoji enregistré'
    })

    const res = await request(app).get('/emoji/random')
    expect(res.statusCode).toBe(404)
  })

  test('retourne 500 si stockage-service indisponible', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis/random`).networkError()

    const res = await request(app).get('/emoji/random')
    expect(res.statusCode).toBe(500)
  })
})

// === GET /emoji/stats ===
describe('GET /emoji/stats', () => {
  test('retourne les statistiques globales', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis`).reply(200, [
      { id: 1, emoji: '😀' },
      { id: 2, emoji: '😂' }
    ])
    mock.onGet(`${STOCKAGE_URL}/stats`).reply(200, [
      { emoji: '😀', count: 10, score: 0.8 }
    ])
    mock.onGet(`${STOCKAGE_URL}/emojis/top`).reply(200, [
      { emoji: '😀', total: 10 },
      { emoji: '😂', total: 5 }
    ])

    const res = await request(app).get('/emoji/stats')
    expect(res.statusCode).toBe(200)
    expect(res.body.total).toBe(2)
    expect(Array.isArray(res.body.top)).toBe(true)
    expect(Array.isArray(res.body.stats)).toBe(true)
  })

  test('retourne 500 si stockage-service indisponible', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis`).networkError()

    const res = await request(app).get('/emoji/stats')
    expect(res.statusCode).toBe(500)
  })
})

// === GET /metrics ===
describe('GET /metrics', () => {
  test('retourne les métriques', async () => {
    mock.onGet(`${STOCKAGE_URL}/emojis`).reply(200, [
      { id: 1, emoji: '😀' },
      { id: 2, emoji: '😂' }
    ])

    const res = await request(app).get('/metrics')
    expect(res.statusCode).toBe(200)
    expect(res.body.service).toBe('api-service')
    expect(res.body.total_emojis).toBe(2)
    expect(res.body.timestamp).toBeDefined()
  })
})