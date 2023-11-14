const express = require('express');
const router = express.Router();
const client = require('../connection');

// see all users
router.get('/', async (_request, response) => {
  try {
    const { rows } = await client.query('SELECT * FROM users');
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// signin
router.post('/login', async (_request, response) => {
  const { email, password } = _request.body;

  try {
    const { rows } = await client.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    response.send(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

// signup
router.post('/signup', async (_request, response) => {
  const { username, email, password, first_name, last_name } = _request.body;
  try {
    await client.query(
      'INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password, first_name, last_name]
    );
    response.status(201).json({
      success: true,
      message: 'User added successfully',
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// edit user info
router.put('/', async (_request, response) => {
  const { id, username, email, password, first_name, last_name } =
    _request.body;
  try {
    await client.query(
      'UPDATE users SET username = $1, email = $2, password = $3, first_name = $4, last_name = $5 WHERE id = $6',
      [username, email, password, first_name, last_name, id]
    );
    const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    response.status(201).json({
      success: true,
      message: 'User information updated',
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// remove user
router.delete('/', async (_request, response) => {
  const { id } = _request.body;

  try {
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    response.status(201).json({
      success: true,
      message: 'User is deleted',
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
