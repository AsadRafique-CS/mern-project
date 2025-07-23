# MERN Stack Social Network Test Project

This is a 4-part full-stack MERN project simulating a mini social network with login, feed, RBAC, testing, and debugging tasks.

---

## Folder Structure

├── db/ # MongoDB schema design and aggregation pipeline
├── api/ # Node.js + Express REST API
├── web/ # React + Vite frontend SPA
├── debug/ # Debugging tasks and fixed code
└── README.md # This file

yaml
Copy
Edit

---

## Part 1: MongoDB Aggregation & Schema Design

### 📦 Schema Designs

**users**
```js
{
  _id: ObjectId("u1"),
  name: "Alice",
  joined: ISODate("2024-01-15T09:00Z")
}
follows

js
Copy
Edit
{
  follower: "u1",
  following: "u2"
}
posts

js
Copy
Edit
{
  _id: ObjectId("p1"),
  author: "u2",
  content: "Hello!",
  created: ISODate("2024-03-10T18:00Z")
}
🧠 Indexing for Performance
users: index on _id (default)

posts: compound index on { author: 1, created: -1 }

follows: index on follower (and optionally following for reverse lookups)

🧮 Aggregation Pipeline (in db/aggregation.js)
Join follows → posts → users

Filter by follower

Unwind + project content, created, author name

Sorted by created, limited to 10
Part 2: Node.js API with RBAC
📂 Location: api/index.js
Express server with:

POST /login: returns JWT for hardcoded users

DELETE /posts/:id: protected by custom authorize(roles[]) middleware

GET /feed?page=N: returns paginated posts

👥 Hardcoded Users
u1: { id: 'u1', role: 'user' }

u2: { id: 'u2', role: 'admin' }

✅ Tests (in api/__tests__/auth.test.js)
Run with:

bash
Copy
Edit
npm install
npm test
Covers:

✅ Admin can delete

❌ User can't delete

❌ Invalid/missing token returns 403

Part 3: React Frontend (SPA)
📂 Location: web/
Built with React + Vite

JWT stored in memory (context)

Feed.jsx with infinite scroll

useApi() custom hook handles fetch/caching

Conditional delete button for admins

🔧 Setup Instructions
bash
Copy
Edit
cd web
npm install
npm run dev
Login with u1 or u2

Feed.jsx supports infinite scroll

Admin (u2) sees delete buttons

Part 4: Debugging & Code Review
📂 Location: debug/postsController.fixed.js
🐞 Issues Found:
❌ posts.sort() happens after full fetch (slow with large data)

❌ No await or error handling in route

❌ created is a Date, but .sort() may fail without proper parsing

✅ Fixes:
Use .find().sort({ created: -1 }).limit(10 )

Add try/catch for error safety

Move console.log('Done') inside success

📦 Project Commands Summary
API
bash
Copy
Edit
cd api
npm install
node index.js  # Runs at http://localhost:3000
npm test       # Runs 3 test cases
Web
bash
Copy
Edit
cd web
npm install
npm run dev    # Runs React app at http://localhost:5173
