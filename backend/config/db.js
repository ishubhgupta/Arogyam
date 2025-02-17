import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  ssl: false, // Disable SSL
});


// pool.connect()
//   .then(() => console.log("Database connected to PostgreSQL"))
//   .catch((err) => console.error("Error while connecting:", err));

export default pool;