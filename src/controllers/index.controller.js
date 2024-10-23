import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);  
  try {
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);    
    // Verificar si se encontró el usuario
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "User not found"});
    }
    // Si el usuario se encuentra, devolver los datos
    res.json(response.rows[0]);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error del servidor" });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );

  return res.json(rows[0]);
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const { rows, rowCount } = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Devuelve los datos del usuario eliminado
    return res.status(200).json({ message: "El usuario eliminado es: "}, rows.id[0]);
  } catch (error) {
    // Manejo del error
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

