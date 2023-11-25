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

router.put('/settings/:type', async (req, res) => {
  const { type } = req.params
  const { userId, change } = req.body

  try {
    let query, values

    if (type === 'opacity') {
      query = 'UPDATE user_settings SET opacity = $1 WHERE user_id = $2'
      values = [change, userId]
    } else if (type === 'background_color') {
      query = 'UPDATE user_settings SET background_color = $1 WHERE user_id = $2'
      values = [change, userId]
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid setting type',
      })
    }

    await client.query(query, values)

    res.json({
      success: true,
      message: 'User settings updated successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
