const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'super-secret';

// Hardcoded users
const users = {
  u1: { id: 'u1', role: 'user' },
  u2: { id: 'u2', role: 'admin' }
};

// 🔐 Login route
app.post('/login', (req, res) => {
  const { id } = req.body;
  const user = users[id];
  if (!user) return res.status(401).json({ message: 'Invalid user' });

  const token = jwt.sign(user, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// ✅ Middleware
function authorize(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(403);

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, SECRET);
      if (!roles.includes(payload.role)) return res.status(403).json({ message: 'Forbidden' });
      req.user = payload;
      next();
    } catch {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}

// 🔥 DELETE protected route
app.delete('/posts/:id', authorize(['admin']), (req, res) => {
  res.json({ message: `Post ${req.params.id} deleted successfully.` });
});

// 📰 Dummy feed route
// 📰 Paginated feed route
app.get('/feed', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const start = (page - 1) * limit;

  const allPosts = Array.from({ length: 100 }, (_, i) => ({
    _id: `post${i + 1}`,
    author: `User ${i + 1}`,
    content: `This is post ${i + 1}`,
    created: new Date(Date.now() - i * 60000).toISOString() // 1-minute difference
  }));

  const paginatedPosts = allPosts.slice(start, start + limit);
  res.json(paginatedPosts);
});


// 🔁 Start server (for both normal and test mode)
if (require.main === module) {
  app.listen(3000, () => {
    console.log(`API running at http://localhost:3000`);
  });
}

module.exports = app;
