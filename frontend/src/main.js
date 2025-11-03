/**
 * Summary:
 * 1. Prepara elementos da UI (hero, sugestões, placeholder e grid).
 * 2. Aplica skeletons, estados vazio/erro e contador de resultados.
 * 3. Compartilha a lógica de busca entre botão, Enter e sugestões rápidas.
 */

import '../style.css'                                           // estilos globais
import { fetchResults } from './api.js'                         // comunicação com o backend
import { createProductCard } from './components/productCard.js' // montagem do card

const btn = document.getElementById('scrapeBtn')
const input = document.getElementById('keyword')
const resultsContainer = document.getElementById('results')
const placeholder = document.getElementById('resultsPlaceholder')
const statusEl = document.getElementById('searchStatus')
const suggestionButtons = document.querySelectorAll('[data-suggestion]')

const countFormatter = new Intl.NumberFormat('pt-BR')

if (!btn || !input || !resultsContainer) {
  throw new Error('Elementos base da interface não foram encontrados.')
}

let activeRequestId = 0

const placeholderTitle = placeholder?.querySelector('h3') || null
const placeholderCopy = placeholder?.querySelector('p') || null

function updateStatus(message) {
  if (!statusEl) return
  if (!message) {
    statusEl.textContent = ''
    statusEl.hidden = true
    return
  }
  statusEl.hidden = false
  statusEl.textContent = message
}

function setPlaceholder(state, keyword = '') {
  if (!placeholder || !placeholderTitle || !placeholderCopy) return

  const term = keyword.trim()
  const quoted = term ? `“${term}”` : ''

  switch (state) {
    case 'empty':
      placeholderTitle.textContent = `Nenhum resultado para ${quoted}`
      placeholderCopy.textContent =
        'Tente variar as palavras-chave, incluir a categoria ou usar outro termo relacionado.'
      break
    case 'error':
      placeholderTitle.textContent = 'Ops! Algo deu errado'
      placeholderCopy.textContent =
        'Não foi possível buscar os produtos agora. Tente novamente em instantes.'
      break
    default:
      placeholderTitle.textContent = 'Pesquise por um produto'
      placeholderCopy.textContent =
        'Use palavras-chave específicas como “smartphone 5G” ou “cadeira gamer ergonômica”.'
      break
  }

  placeholder.hidden = false
}

function clearResults() {
  if (resultsContainer) {
    resultsContainer.innerHTML = ''
  }
}

function renderSkeletons(count = 6) {
  if (!resultsContainer) return

  clearResults()
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < count; i += 1) {
    const skeleton = document.createElement('article')
    skeleton.className = 'card card--skeleton'
    skeleton.innerHTML = `
      <div class="card__image-wrapper"></div>
      <div class="card__body">
        <div class="skeleton-block skeleton-block--price"></div>
        <div class="skeleton-block skeleton-block--title"></div>
        <div class="skeleton-grid">
          <span class="skeleton-block skeleton-block--meta"></span>
          <span class="skeleton-block skeleton-block--meta"></span>
        </div>
      </div>
    `
    fragment.appendChild(skeleton)
  }

  resultsContainer.appendChild(fragment)
}

async function executeSearch(rawTerm) {
  const keyword = rawTerm.trim()

  if (!keyword) {
    updateStatus('Informe um termo para buscar produtos.')
    setPlaceholder('default')
    clearResults()
    input.focus()
    return
  }

  const requestId = ++activeRequestId
  if (placeholder) {
    placeholder.hidden = true
  }
  renderSkeletons()
  updateStatus(`Buscando por “${keyword}”…`)

  try {
    const products = await fetchResults(keyword)
    if (requestId !== activeRequestId) return

    clearResults()

    if (!products.length) {
      setPlaceholder('empty', keyword)
      updateStatus(`Nenhum resultado para “${keyword}”`)
      return
    }

    const fragment = document.createDocumentFragment()
    products.forEach(item => {
      fragment.appendChild(createProductCard(item))
    })

    resultsContainer.appendChild(fragment)
    if (placeholder) {
      placeholder.hidden = true
    }

    const total = countFormatter.format(products.length)
    const plural = products.length > 1 ? 'resultados' : 'resultado'
    updateStatus(`Mostrando ${total} ${plural} para “${keyword}”`)
  } catch (err) {
    console.error(err)
    if (requestId !== activeRequestId) return

    clearResults()
    setPlaceholder('error')
    updateStatus('Não foi possível buscar os produtos. Tente novamente em instantes.')
  }
}

btn?.addEventListener('click', () => executeSearch(input.value))

input?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault()
    executeSearch(input.value)
  }
})

suggestionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const suggestion = button.dataset.suggestion || ''
    if (!suggestion) return
    input.value = suggestion
    input.focus()
    executeSearch(suggestion)
  })
})

setPlaceholder('default')
updateStatus('')
