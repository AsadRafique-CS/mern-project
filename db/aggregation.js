// Get latest 10 posts from followings of a given user
const userId = "u1"; // example user ID

db.follows.aggregate([
  // Step 1: Find followings of u1
  { $match: { follower: "u1" } },

  // Step 2: Join with posts
  {
    $lookup: {
      from: "posts",
      localField: "following",
      foreignField: "author",
      as: "posts"
    }
  },

  // Step 3: Unwind posts
  { $unwind: "$posts" },

  // Step 4: Join with users to get author's name
  {
    $lookup: {
      from: "users",
      localField: "posts.author",
      foreignField: "_id",
      as: "authorInfo"
    }
  },

  { $unwind: "$authorInfo" },

  // Step 5: Format output
  {
    $project: {
      _id: "$posts._id",
      content: "$posts.content",
      created: "$posts.created",
      author: "$authorInfo.name"
    }
  },

  // Step 6: Sort & limit
  { $sort: { created: -1 } },
  { $limit: 10 }
])

// To maximize read performance:

// 1. The `users` collection is indexed on `_id` (default).
// 2. The `posts` collection should have a **compound index** on `{ author: 1, created: -1 }` to support fast queries sorted by time per user.
// 3. The `follows` collection should be indexed on `follower` to quickly find whom a user follows.
// 4. If reverse lookup is needed, index `following` as well.
