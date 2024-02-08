
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'postgres',
    port: 5432,
    user: 'db',
    password: 'db',
    database: 'db'
});

export default pool;
