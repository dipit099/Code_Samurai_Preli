
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.ygbtzjrgwxgjapzbqfjh',
    password: 'KLKrGwXtUrPGtk3E',
    database: 'postgres'
});

export default pool;
