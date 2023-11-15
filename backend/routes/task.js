const express = require('express')
const router = express.Router()
const client = require('../connection')

// see all tasks
router.get('/', async (_request, response) => {
  try {
    const { rows } = await client.query('SELECT * FROM tasks')
    response.send(rows)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

// get a tasks by id
router.get('/:id', async (request, response) => {
  const { id } = request.params
  console.log(id)
  try {
    const { rows } = await client.query('SELECT * FROM tasks WHERE id = $1', [
      id,
    ])
    response.send(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})


// delete a tasks
router.delete('/:id', async (request, response) => {
  const { id } = request.params
  try {
    await client.query('DELETE FROM tasks WHERE id = $1', [id])
    response.json({ message: 'tasks deleted successfully.' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

// post a new tasks
router.post('/', async (request, response) => {
  const { name, user_id } = request.body
  try {
    const { rows } = await client.query(
      'INSERT INTO tasks (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, user_id],
    )
    response.status(201).json(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

// update a tasks
router.put('/:id', async (request, response) => {
  const { id } = request.params
  const { name, user_id } = request.body
  try {
    const { rows } = await client.query(
      'UPDATE tasks SET name = $1, user_id = $2 WHERE id = $3 RETURNING *',
      [name, user_id, id],
    )
    response.json(rows[0])
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})
module.exports = router
