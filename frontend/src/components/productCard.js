/**
 * Summary:
 * 1. Recebe um produto com título, preço, avaliação, reviews e imagem.
 * 2. Monta um <article> com foto, selo de avaliação, preço e metadados.
 * 3. Normaliza contagem de reviews para o padrão pt-BR (ex.: 12.530).
 * 4. Retorna o card pronto para renderização na grid de resultados.
 *
 * @param {{ title: string, price: string|null, rating: string|null, reviews: string|null, image: string|null }} item
 * @returns {HTMLElement}
 */
const numberFormatter = new Intl.NumberFormat('pt-BR')

export function createProductCard(item) {
  const card = document.createElement('article')
  card.className = 'card'

  const reviewsNumber = Number(item.reviews || 0)
  const reviewsDisplay = reviewsNumber ? numberFormatter.format(reviewsNumber) : '0'
  const ratingDisplay = item.rating || '—'
  const hasPrice = Boolean(item.price)
  const priceValue = hasPrice ? item.price : 'Indisponível'
  const priceMarkup = `
    <div class="card__price${hasPrice ? '' : ' card__price--muted'}">
      <span class="card__price-label">Preço</span>
      <span class="card__price-value">${priceValue}</span>
    </div>
  `

  card.innerHTML = `
    <div class="card__image-wrapper">
      <img
        src="${item.image || ''}"
        alt="${item.title}"
        loading="lazy"
      />
      ${item.rating ? `<span class="card__badge">⭐ ${item.rating}</span>` : ''}
    </div>

    <div class="card__body">
      ${priceMarkup}
      <h3 class="card__title">${item.title}</h3>
      <div class="card__meta">
        <div class="card__meta-item">
          <span class="card__meta-label">Avaliação</span>
          <span class="card__meta-value">${ratingDisplay}</span>
        </div>
        <div class="card__meta-item">
          <span class="card__meta-label">Reviews</span>
          <span class="card__meta-value">${reviewsDisplay}</span>
        </div>
      </div>
    </div>
  `

  return card
}
