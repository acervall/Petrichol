const express = require('express')
const router = express.Router()
const client = require('../connection')

// see all folders
router.get('/', async (_request, response) => {
  try {
    const { rows } = await client.query('SELECT * FROM folders')
    response.send(rows)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

module.exports = router
