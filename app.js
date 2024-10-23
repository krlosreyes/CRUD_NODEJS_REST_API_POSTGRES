// app.js
import { pool } from './src/db.js';

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa:', res.rows[0]);
  } catch (err) {
    console.error('Error al conectar:', err);
  } finally {
    await pool.end();  // Asegúrate de usar await con pool.end()
  }
};

testConnection();
