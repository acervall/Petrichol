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

// DELETE task
router.delete('/:taskId', async (request, response) => {
  const userId = getUserIdFromHeaders(request);
  const { taskId } = request.params;

  try {
    const result = await client.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Task not found.' });
    } else {
      response.json({ message: 'Task deleted successfully.' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// POST new task
router.post('/', async (request, response) => {
  const userId = getUserIdFromHeaders(request);
  const { name } = request.body;

  try {
    const { rows } = await client.query(
      'INSERT INTO tasks (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    response.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// PUT Update a task
router.put('/:taskId', async (request, response) => {
  const userId = getUserIdFromHeaders(request);
  const { taskId } = request.params;
  const { name } = request.body;

  try {
    const result = await client.query(
      'UPDATE tasks SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, taskId, userId]
    );

    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Task not found.' });
    } else {
      response.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
