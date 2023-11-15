const express = require('express')
const cors = require('cors')
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require("pg");

dotenv.config();

const app = express()
const port = process.env.PORT || 3000

const userRouter = require('./routes/user')
const folderRouter = require('./routes/folder')
const listRouter = require('./routes/list')
const taskRouter = require('./routes/task')

app.use(express.json())

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  }),
)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({ message: err.message })
  return
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter)
app.use('/folder', folderRouter)
app.use('/list', listRouter)
app.use('/task', taskRouter)

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`)
})
