import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const params = [];
    let query = 'SELECT * FROM leads WHERE 1=1';
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`; }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { name, email, country, status = 'New', assigned_to } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const { rows } = await pool.query(
      'INSERT INTO leads (name, email, country, status, assigned_to) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, email, country, status, assigned_to]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { name, email, country, status, assigned_to } = req.body;
    const { rows } = await pool.query(
      'UPDATE leads SET name=$1, email=$2, country=$3, status=$4, assigned_to=$5 WHERE id=$6 RETURNING *',
      [name, email, country, status, assigned_to, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
