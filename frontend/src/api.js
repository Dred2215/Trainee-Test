// src/api.js

/**
 * Summary:
 * 1. Build the API endpoint URL using the provided keyword.
 * 2. Send a GET request to the backend scraper endpoint.
 * 3. Check the HTTP status and throw an error if it’s not successful.
 * 4. Parse the response body as JSON to get the products array.
 * 5. Return the array of product objects to the caller.
 *
 * @param {string} keyword — the search term to query on Amazon
 * @returns {Promise<Array<{ title: string, rating: string, reviews: string, image: string }>>}
 */
export async function fetchResults(keyword) {
  // 1. Construct the URL, encoding the keyword to handle special characters
  const url = `/api/scrape?keyword=${encodeURIComponent(keyword)}`

  // 2. Execute the GET request against our backend API
  const response = await fetch(url)

  // 3. Validate the response status (200–299); throw if not OK
  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`)
  }

  // 4. Parse the JSON payload from the response
  const data = await response.json()

  // 5. Return the parsed data (an array of product objects)
  return data
}
