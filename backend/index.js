import express from 'express'               // Express: fast, unopinionated web framework
import cors from 'cors'                     // CORS middleware to enable cross-origin requests
import { scrapeResults } from './src/scraper.js'  // Import the scraping function

/**
 * Summary:
 * 1. Initialize an Express server.
 * 2. Enable CORS so the frontend (running on a different port) can call this API.
 * 3. Define a GET /api/scrape route:
 *    a) Read the "keyword" query parameter.
 *    b) Validate that the keyword is provided, otherwise return 400 Bad Request.
 *    c) Call scrapeResults(keyword) to perform the scraping.
 *    d) Return the scraped product data as JSON, or send 500 on error.
 * 4. Start the server on the specified port and log a startup message.
 */

const app = express()         // Create a new Express application
app.use(cors())               // Apply the CORS middleware to all routes

const PORT = 3000             // Port where the server listens

// Route: GET /api/scrape?keyword=<search term>
app.get('/api/scrape', async (req, res) => {
  // a) Extract the keyword from the query string
  const keyword = req.query.keyword

  // b) If no keyword is provided, respond with HTTP 400 and an error message
  if (!keyword) {
    return res
      .status(400)
      .json({ error: 'keyword is required' })
  }

  try {
    // c) Perform the scraping logic and wait for the results array
    const data = await scrapeResults(keyword)

    // d) Send the scraped data back as JSON
    res.json(data)
  } catch (err) {
    // Log the error details for debugging
    console.error(err)

    // Respond with HTTP 500 and a generic error message
    res
      .status(500)
      .json({ error: 'Internal server error during scraping' })
  }
})

// Start the server and log the address
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
