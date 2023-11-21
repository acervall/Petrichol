const express = require('express');
const router = express.Router();
const client = require('../connection');

const getUserIdFromHeaders = (request) => {
  const userId = request.headers['user-id'] || '1';
  return userId;
};

// see all tasks
router.get('/', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    const { rows } = await client.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// get a task by id
router.get('/:id', async (request, response) => {
  const userId = getUserIdFromHeaders(request);
  const { id } = request.params;

  try {
    const { rows } = await client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);
    response.send(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = router
