/**
 * Summary:
 * 1. Receive a product object with title, rating, reviews, and image URL.
 * 2. Create a container <div> and apply the "card" CSS class.
 * 3. Populate the container’s innerHTML with:
 *    - An <img> showing the product thumbnail.
 *    - A nested <div> for text content.
 *    - A <h3> for the product title.
 *    - Two <p> elements for the rating and review count (with sensible fallbacks).
 * 4. Return the fully assembled HTMLElement for insertion into the DOM.
 *
 * @param {{ title: string, rating: string, reviews: string, image: string }} item
 *   — Object containing the product’s details.
 * @returns {HTMLElement}
 *   — A DOM element representing the product card.
 */
export function createProductCard(item) {
  // 2. Create the outer container for the card
  const card = document.createElement('div') // <div> that will hold image and content
  card.className = 'card'                     // apply the CSS class for card styling

  // 3. Build the card’s internal HTML structure using a template literal
  card.innerHTML = `
    <!-- Product thumbnail -->
    <img 
      src="${item.image}" 
      alt="${item.title}" 
      class="card__image"
    />

    <!-- Container for text details -->
    <div class="card-content">
      <!-- Product title -->
      <h3 class="card-content__title">${item.title}</h3>
      <!-- Product rating, or "N/A" if missing -->
      <p class="card-content__rating">
        Rating: ${item.rating || 'N/A'}
      </p>
      <!-- Number of reviews, or "0" if missing -->
      <p class="card-content__reviews">
        Reviews: ${item.reviews || '0'}
      </p>
    </div>
  ` // end of template string

  // 4. Return the assembled card element
  return card
}
