const express = require('express');
const router = express.Router();
const client = require('../connection');

const getUserIdFromHeaders = (request) => {
  const userId = request.headers['user-id'];
  return userId;
};

// GET see all folders for a user
router.get('/', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    console.log('userId:',userId)
    const { rows } = await client.query(
      'SELECT * FROM folders WHERE user_id = $1',
      [userId]
    );
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// get a folder by id with associated lists
router.get('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const folderQuery = 'SELECT * FROM folders WHERE id = $1';
    const folderResult = await client.query(folderQuery, [id]);
    const folder = folderResult.rows[0];

    if (!folder) {
      return response.status(404).json({ error: 'Folder not found' });
    }

    const listsQuery = 'SELECT * FROM lists WHERE folder_id = $1';
    const listsResult = await client.query(listsQuery, [id]);
    const lists = listsResult.rows;

    const folderWithLists = {
      ...folder,
      lists,
    };

    response.json(folderWithLists);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// delete a folder
router.delete('/:id', async (request, response) => {
  const { id } = request.params;
  try {
    await client.query('DELETE FROM folders WHERE id = $1', [id]);
    response.json({ message: 'Folder deleted successfully.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// post a new folder
router.post('/', async (request, response) => {
  const { name } = request.body;
  const userId = getUserIdFromHeaders(request);
  console.log('userId:',userId)

  try {
    const { rows } = await client.query(
      'INSERT INTO folders (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId],
    );
    response.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// update a folder
router.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  const userId = getUserIdFromHeaders(request);
  console.log('userId:',userId)

  try {
    const { rows } = await client.query(
      'UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, userId],
    );
    response.json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// GET see all lists without a folder for a user
router.get('/lists', async (request, response) => {
  try {
    const userId = getUserIdFromHeaders(request);
    console.log('userId:',userId)
    const { rows } = await client.query(
      'SELECT * FROM lists WHERE folder_id IS NULL AND user_id = $1',
      [userId]
    );
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
