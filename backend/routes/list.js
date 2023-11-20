const express = require('express')
const router = express.Router()
const client = require('../connection')

const getUserIdFromHeaders = (request) => {
  const userId = request.headers['user-id'] || '1';
  return userId;
};

// GET see all lists
router.get('/', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    const { rows } = await client.query('SELECT * FROM lists WHERE user_id = $1', [userId]);
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// GET a list by id
router.get('/:id', async (request, response) => {
  const userId = getUserIdFromHeaders(request);
  const { id } = request.params;
  const listId = parseInt(id, 10);

  try {
    const { rows } = await client.query(
      `
      SELECT lists.name as list_name, tasks.*
      FROM lists
      LEFT JOIN tasks ON lists.id = tasks.list_id
      WHERE lists.id = $1 AND lists.user_id = $2
      `,
      [listId, userId],
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

// DELETE delete a list
router.delete('/:listId', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    const listId = parseInt(request.params.listId);

    const checkListQuery = 'SELECT * FROM lists WHERE id = $1 AND user_id = $2';
    const checkListResult = await client.query(checkListQuery, [listId, userId]);

    if (checkListResult.rows.length === 0) {
      return response.status(404).json({ error: 'List not found' });
    }

    const deleteListQuery = 'DELETE FROM lists WHERE id = $1';
    await client.query(deleteListQuery, [listId]);

    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// PUT update a list
router.put('/:listId', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    const listId = parseInt(request.params.listId);
    const { name, folder_id } = request.body;

    const checkListQuery = 'SELECT * FROM lists WHERE id = $1 AND user_id = $2';
    const checkListResult = await client.query(checkListQuery, [listId, userId]);

    if (checkListResult.rows.length === 0) {
      return response.status(404).json({ error: 'List not found' });
    }

    const updateListQuery = 'UPDATE lists SET name = $1, folder_id = $2 WHERE id = $3 RETURNING *';
    const updatedListResult = await client.query(updateListQuery, [name, folder_id, listId]);

    response.status(200).json(updatedListResult.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// POST create a new list with user ID extracted from headers
router.post('/add', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    const { name, folder_id } = request.body;
    const { rows } = await client.query(
      'INSERT INTO lists (name, user_id, folder_id) VALUES ($1, $2, $3) RETURNING *',
      [name, userId, folder_id]
    );
    response.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// POST get a list and its tasks
router.post('/', async (_request, response) => {
  const { listId, userId } = _request.body;
  try {
    const { rows } = await client.query(
      `
      SELECT lists.name as list_name, tasks.*
      FROM lists
      LEFT JOIN tasks ON lists.id = tasks.list_id
      JOIN users ON lists.user_id = users.id
      WHERE lists.id = $1 AND users.id = $2;
      `,
      [listId, userId],
    );

    if (rows.length === 0) {
      console.log('ROWS', rows);
      response.status(404).json({ error: 'List not found' });
    } else {
      const listData = {
        listName: rows[0].list_name,
        tasks: rows.map((row) => ({ id: row.id, name: row.name })),
      };
      response.json(listData);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = router
