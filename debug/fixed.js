// debug/fixed.js

// ✅ FIXED IMPLEMENTATION
async function getSortedPosts(req, res) {
  try {
    // Let MongoDB handle the sorting — faster & more efficient
    const posts = await Posts.find().sort({ created: -1 });
    res.json(posts);
  } catch (err) {
    // Catch and log errors to avoid request hanging
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
