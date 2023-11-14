const express = require('express')
const router = express.Router()
const client = require('../connection')
const tasksRouter = require('./task');

// GET see all lists
router.get('/', async (_request, response) => {
  try {
    const { rows } = await client.query('SELECT * FROM lists')
    response.send(rows)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: error.message })
  }
})

// GET a list by id
router.get('/:id', async (request, response) => {
  const { id } = request.params;
  const listId = parseInt(id, 10);

  try {
    const { rows } = await client.query(
      `
      SELECT lists.name as list_name, tasks.*
      FROM lists
      LEFT JOIN tasks ON lists.id = tasks.list_id
      WHERE lists.id = $1`,
      [listId],
    );

    if (rows.length === 0) {
      response.status(404).json({ error: 'List not found' });
    } else {
      const listData = {
        listName: rows[0].list_name,
        tasks: rows.map((row) => ({ id: row.id, name: row.name })),
      };
      response.json(listData);
    }
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ error: error.message });
  }
});


// DELETE task
router.delete('/:listId/tasks/:taskId', async (request, response) => {
  const { listId, taskId } = request.params;

  try {
    const result = await client.query(
      'DELETE FROM tasks WHERE id = $1 AND list_id = $2 RETURNING *',
      [taskId, listId]
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
router.post('/:listId/tasks', async (request, response) => {
  const { listId } = request.params;
  const { name } = request.body;

  try {
    const { rows } = await client.query(
      'INSERT INTO tasks (name, list_id) VALUES ($1, $2) RETURNING *',
      [name, listId]
    );
    response.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});


// PUT Update a task within a list
router.put('/:listId/tasks/:taskId', async (request, response) => {
  const { taskId } = request.params;
  const { name } = request.body;

  try {
    const result = await client.query(
      'UPDATE tasks SET name = $1 WHERE id = $2 RETURNING *',
      [name, taskId]
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

router.use('/:listId/tasks', tasksRouter);
module.exports = router
