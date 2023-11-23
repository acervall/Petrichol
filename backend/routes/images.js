const express = require('express')
const router = express.Router()
const client = require('../connection')

router.post('/getImages', async (request, response) => {
  const { userId } = request.body

  try {
    const result = await client.query(
      `SELECT * FROM images
		 WHERE user_id = $1;`,
      [userId],
    )

    const images = result.rows

    response.json({ success: true, images })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

router.post('/addImage', async (request, response) => {
  const { userId, imageUrl, altText, isActive } = request.body
  console.log('Trying to upload', request.body)

  try {
    if (isActive) {
      await client.query(
        `UPDATE images
			SET active = false
			WHERE user_id = $1`,
        [userId],
      )
    }

    const result = await client.query(
      `INSERT INTO images (url, alt, user_id, active)
		 VALUES ($1, $2, $3, $4)
		 RETURNING *;`,
      [imageUrl, altText, userId, isActive],
    )

    const addedImage = result.rows[0]

    response.json({ success: true, message: 'Image added successfully', addedImage })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

router.put('/updateActiveImage', async (request, response) => {
  const { userId, imageId } = request.body
  try {
    await client.query(
      `UPDATE images
		 SET active = CASE
		   WHEN id = $2 THEN true
		   ELSE false
		 END
		 WHERE user_id = $1;`,
      [userId, imageId],
    )

    response.json({ success: true, message: 'Image activity updated successfully' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

module.exports = router
