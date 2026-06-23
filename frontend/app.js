// ── Config ─────────────────────────────────
const API = window.API_URL;
let feedItems = []

// ── Helpers ────────────────────────────────
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast')
  el.className = `show ${type}`
  el.innerHTML = `<span>${type === 'ok' ? '✅' : '❌'}</span> ${msg}`
  clearTimeout(el._t)
  el._t = setTimeout(() => { el.className = '' }, 3000)
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── API Health check ────────────────────────
async function checkHealth() {
  try {
    await apiFetch('/emoji/stats')
    document.getElementById('api-dot').className = 'dot'
    document.getElementById('api-status').textContent = 'API connectée'
  } catch {
    document.getElementById('api-dot').className = 'dot offline'
    document.getElementById('api-status').textContent = 'API hors-ligne'
  }
}

// ── Send emoji ──────────────────────────────
async function sendEmoji() {
  const emoji   = document.getElementById('emoji-input').value.trim()
  const user    = document.getElementById('user-input').value.trim() || 'anonyme'
  const message = document.getElementById('msg-input').value.trim()

  if (!emoji) { toast('Entrez un emoji !', 'err'); return }

  const btn = document.querySelector('button[onclick="sendEmoji()"]')
  const lbl = document.getElementById('send-label')
  btn.disabled = true
  lbl.innerHTML = '<span class="spinner"></span>'

  try {
    await apiFetch('/emoji', {
      method: 'POST',
      body: JSON.stringify({ emoji, utilisateur: user, message }),
    })

    toast(`Emoji ${emoji} envoyé !`)
    feedItems.unshift({ emoji, user, message, time: new Date() })
    renderFeed()

    document.getElementById('emoji-input').value = ''
    document.getElementById('msg-input').value = ''

    fetchStats()

  } catch (e) {
    toast('Erreur lors de l\'envoi : ' + e.message, 'err')
  } finally {
    btn.disabled = false
    lbl.textContent = 'Envoyer'
  }
}

// ── Random emoji ────────────────────────────
async function fetchRandom() {
  const btn = document.querySelector('button[onclick="fetchRandom()"]')
  const lbl = document.getElementById('random-label')
  btn.disabled = true
  lbl.innerHTML = '<span class="spinner"></span>'

  try {
    const data = await apiFetch('/emoji/random')

    const emojiEl = document.getElementById('random-emoji')
    const metaEl  = document.getElementById('random-meta')

    emojiEl.style.transform = 'scale(0.5) rotate(-15deg)'
    emojiEl.style.opacity = '0'
    setTimeout(() => {
      emojiEl.textContent = data.emoji || '❓'
      emojiEl.style.transform = ''
      emojiEl.style.opacity = '1'
    }, 150)

    const msg = data.message ? `"${data.message}"` : ''
    metaEl.innerHTML = `
      <strong>${data.utilisateur || 'anonyme'}</strong><br>
      <span style="color:var(--muted)">${msg}</span>
    `

  } catch (e) {
    toast('Erreur : ' + e.message, 'err')
  } finally {
    btn.disabled = false
    lbl.textContent = '🎲 Tirer au sort'
  }
}

// ── Stats ───────────────────────────────────
async function fetchStats() {
  try {
    const data = await apiFetch('/emoji/stats')

    document.getElementById('stat-total').textContent = data.total ?? '?'

    const top = data.top ?? []
    const maxCount = top[0]?.total || 1

    document.getElementById('stat-top').textContent = top[0]?.emoji || '—'

    const listEl = document.getElementById('stats-list')
    if (top.length === 0) {
      listEl.innerHTML = '<div class="empty-state">Aucune donnée encore.</div>'
      return
    }

    listEl.innerHTML = top.map((item, i) => `
      <div class="stat-row">
        <span class="stat-rank">#${i + 1}</span>
        <span class="stat-emoji">${item.emoji}</span>
        <div class="stat-bar-wrap">
          <div class="stat-bar" data-pct="${(item.total / maxCount) * 100}"></div>
        </div>
        <span class="stat-count">${item.total}</span>
      </div>
    `).join('')

    requestAnimationFrame(() => {
      document.querySelectorAll('.stat-bar').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%'
      })
    })

  } catch (e) {
    document.getElementById('stats-list').innerHTML =
      `<div class="empty-state" style="color:var(--error)">Impossible de charger les stats.</div>`
  }
}

// ── Feed ────────────────────────────────────
function renderFeed() {
  const el = document.getElementById('feed-list')
  if (feedItems.length === 0) {
    el.innerHTML = '<div class="empty-state">Envoyez un emoji pour commencer</div>'
    return
  }
  el.innerHTML = feedItems.slice(0, 20).map(item => `
    <div class="feed-item">
      <span class="feed-item-emoji">${item.emoji}</span>
      <div class="feed-item-body">
        <div class="feed-item-user">${item.user}</div>
        <div class="feed-item-msg">${item.message || '—'}</div>
      </div>
      <span class="feed-item-time">${formatTime(item.time)}</span>
    </div>
  `).join('')
}

function formatTime(d) {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ── Init ────────────────────────────────────
checkHealth()
fetchStats()
setInterval(fetchStats, 30000)
setInterval(checkHealth, 10000)