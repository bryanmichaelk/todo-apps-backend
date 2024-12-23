import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import todoRoutes from './models/todo.js';

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = process.env.AZURE_SQL_PORT;
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

console.log({
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  port: process.env.AZURE_SQL_PORT,
});
const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log('Server up and running...'));
app.use('/api/todo', todoRoutes);

app.get('/get', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Define route for the root path
app.get('/', (req, res) => {
  res.status(200).send('Selamat Datang di Backend Render');
});

// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server is up and running on port ${PORT}`);
// });
export const noPasswordConfig = {
  server,
  port,
  database,
  authentication: {
    type,
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export const passwordConfig = {
  server,
  port: parseInt(process.env.AZURE_SQL_PORT, 10),
  database,
  user,
  password,
  options: {
    encrypt: true,
  },
};

module.exports = app;
