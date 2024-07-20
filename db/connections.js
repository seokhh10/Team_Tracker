const { Pool } = require('pg');

// Assign Port
const PORT = process.env.PORT || 3001;

// Connect to database
const pool = new Pool(
  {
    user: 'postgres',
    password: 'seok3525!@',
    host: 'localhost',
    database: 'teamtracker_db'
  },
  console.log(`Connected to the teamtracker_db database.`)
);

pool.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Error connecting to the database:', err));

  module.exports = pool;