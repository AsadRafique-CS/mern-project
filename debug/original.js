// ❌ BUGGY IMPLEMENTATION
async function getSortedPosts(req, res) {
  const posts = await Posts.find();         
  posts.sort((a, b) => b.created - a.created); // Inefficient & risky
  res.json(posts);
}
