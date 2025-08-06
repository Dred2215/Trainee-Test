/**
 * Summary:
 * 1. Import global styles and helper modules.
 * 2. Select DOM elements: search button, input field, and results container.
 * 3. On button click:
 *    a) Read and validate the keyword.
 *    b) Display a loading indicator.
 *    c) Fetch product data from the API.
 *    d) Clear the container and render a card for each product.
 *    e) Handle and display any errors.
 */

import '../style.css'                                         // import global CSS for the app
import { fetchResults } from './api.js'                       // function to call the backend API
import { createProductCard } from './components/productCard.js'// function to build a product card element

// 2. Select essential DOM elements once on load
const btn = document.getElementById('scrapeBtn')              // the "Search" button
const input = document.getElementById('keyword')              // the text input for the keyword
const resultsContainer = document.getElementById('results')   // container where cards will be injected

// 3. Attach an async click handler to the search button
btn.addEventListener('click', async () => {
  // 3.a Read the keyword and trim whitespace
  const kw = input.value.trim()
  // If the input is empty, alert the user and exit early
  if (!kw) {
    alert('Please enter a search keyword')
    return
  }

  // 3.b Show a loading message while data is being fetched
  resultsContainer.innerHTML = '<p>Loading…</p>'

  try {
    // 3.c Fetch the product array from the backend
    const products = await fetchResults(kw)

    // 3.d Clear the loading message before rendering results
    resultsContainer.innerHTML = ''

    // For each product returned, create a card and append it
    products.forEach(item => {
      const card = createProductCard(item)                     // build the card element
      resultsContainer.appendChild(card)                       // insert it into the DOM
    })
  } catch (err) {
    // 3.e On error, log the details for debugging...
    console.error(err)
    resultsContainer.innerHTML =
      '<p style="color: red;">Error fetching data. Please try again later.</p>'
  }
})
