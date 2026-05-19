require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodsaver'
});

db.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL!');
  }
});

// --- USER ROUTES ---

// User signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: 'All fields are required.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.json({ success: false, message: 'Email already exists.' });
    res.json({ success: true, message: 'Account created! Please log in.' });
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.json({ success: false, message: 'User not found.' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: 'Wrong password.' });
    res.json({ success: true, userId: user.id, name: user.name });
  });
});

// --- DONATION ROUTES ---

// Submit a donation
app.post('/api/donate', (req, res) => {
  const { user_id, food_type, quantity, pickup_address } = req.body;
  if (!food_type || !quantity || !pickup_address)
    return res.json({ success: false, message: 'All fields are required.' });

  const sql = 'INSERT INTO donations (user_id, food_type, quantity, pickup_address) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id || null, food_type, quantity, pickup_address], (err, result) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, donationId: result.insertId, message: 'Donation submitted!' });
  });
});

// Check donation status by ID
app.get('/api/donation/:id', (req, res) => {
  db.query('SELECT * FROM donations WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0)
      return res.json({ success: false, message: 'Donation not found.' });
    res.json({ success: true, donation: results[0] });
  });
});

// --- ADMIN ROUTES ---

// Admin login (hardcoded for now - change password!)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Admin logged in.' });
  } else {
    res.json({ success: false, message: 'Invalid admin credentials.' });
  }
});

// Get all donations (admin)
app.get('/api/admin/donations', (req, res) => {
  const sql = `
    SELECT d.*, u.name as donor_name, u.email as donor_email
    FROM donations d
    LEFT JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, donations: results });
  });
});

// Update donation status (admin)
app.put('/api/admin/donation/:id', (req, res) => {
  const { status } = req.body;
  db.query('UPDATE donations SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, message: 'Status updated!' });
  });
});

// Delete a donation (admin)
app.delete('/api/admin/donation/:id', (req, res) => {
  db.query('DELETE FROM donations WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, message: 'Donation deleted.' });
  });
});

// --- DELIVERY ROUTES ---

// Delivery agent signup
app.post('/api/delivery/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO delivery_agents (name, email, password, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
    if (err) return res.json({ success: false, message: 'Email already exists.' });
    res.json({ success: true, message: 'Delivery account created!' });
  });
});

// Delivery agent login
app.post('/api/delivery/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM delivery_agents WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.json({ success: false, message: 'Agent not found.' });
    const agent = results[0];
    const match = await bcrypt.compare(password, agent.password);
    if (!match) return res.json({ success: false, message: 'Wrong password.' });
    res.json({ success: true, agentId: agent.id, name: agent.name });
  });
});

// Get pending donations for delivery agents
app.get('/api/delivery/pending', (req, res) => {
  db.query("SELECT * FROM donations WHERE status = 'Pending' ORDER BY created_at DESC", (err, results) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, donations: results });
  });
});

// --- CONTACT ROUTE ---

// Save contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const sql = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true, message: 'Message sent!' });
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
