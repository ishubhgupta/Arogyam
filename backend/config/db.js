import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD, 
  port: process.env.POSTGRES_PORT,
});

pool.connect()
  .then(() => console.log("Database connected to PostgreSQL"))
  .catch((err) => console.error("Error while connecting:", err));

export default pool;
