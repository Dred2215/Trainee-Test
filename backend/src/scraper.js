import axios from 'axios'                  // HTTP client to fetch the raw HTML of the page
import { JSDOM } from 'jsdom'              // HTML parser in Node, provides a browser-like DOM API

/**
 * Summary:
 * 1. Receive a search keyword and construct the corresponding Amazon search URL.
 * 2. Perform an HTTP GET request to retrieve the raw HTML of the search results page.
 * 3. Parse the HTML with JSDOM to obtain a `document` object.
 * 4. Select each product card element in the page.
 * 5. For each card, extract the title, rating, review count, and image URL.
 * 6. Filter out any entries without a title and return the final array of products.
 *
 * @param {string} keyword — the search term to query on Amazon
 * @returns {Promise<Array<{ title: string, rating: string, reviews: string, image: string }>>}
 */
export async function scrapeResults(keyword) {
  // 1. Build the search URL, encoding special characters (spaces, accents, etc.)
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`

  // 2. Send a GET request to fetch the HTML of the search results page
  //    - User-Agent: simulates a real browser to avoid basic blocking
  //    - Accept-Language: requests Portuguese-Brazil content, falls back to English
  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8'
    }
  })
  // response.data now contains the full HTML of the page

  // 3. Parse the HTML using JSDOM to create a DOM-like environment
  const dom = new JSDOM(response.data)
  const doc = dom.window.document    // document object for DOM queries

  // 4. Select all product card elements
  //    Each card is a div with role="listitem" and data-component-type="s-search-result"
  const items = Array.from(
    doc.querySelectorAll(
      'div[role="listitem"][data-component-type="s-search-result"]'
    )
  )

  // 5. Map each card element to a product data object
  const products = items
    .map(item => {
      // 5.1 Title:
      //     - Try the text inside the <span> within the <h2>
      //     - Fallback to the aria-label of the <h2> if the span is missing
      const h2 = item.querySelector('h2')
      const title =
        h2?.querySelector('span')?.textContent.trim() ||  // clean up whitespace
        h2?.getAttribute('aria-label') ||                // fallback attribute
        null                                              // null if not found

      // 5.2 Rating:
      //     - .a-icon-alt contains strings like "4.5 out of 5 stars"
      //     - split(' ')[0] extracts just the numeric rating "4.5"
      const ratingEl = item.querySelector('.a-icon-alt')
      const rating = ratingEl?.textContent.split(' ')[0] || null

      // 5.3 Review count:
      //     - span with class s-underline-text holds numbers like "8,232"
      //     - replace removes punctuation for a clean numeric string
      const reviewsEl = item.querySelector('span.a-size-base.s-underline-text')
      const reviews = reviewsEl?.textContent.replace(/[.,]/g, '') || null

      // 5.4 Image URL:
      //     - The product thumbnail is in an <img> with class "s-image"
      const imgEl = item.querySelector('img.s-image')
      const image = imgEl?.src || null

      // Return the collected data for this product
      return { title, rating, reviews, image }
    })
    // 5.5 Filter out any entries that did not have a valid title
    .filter(product => product.title !== null)

  // 6. Return the final array of product objects
  return products
}
