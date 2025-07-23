# MongoDB Schema Design

## 📦 Collections

### 🧑 users
```json
{
  "_id": "u1",
  "name": "Alice",
  "joined": ISODate("2024-01-15T09:00:00Z")
}
{
  "follower": "u1",   // u1 follows u2
  "following": "u2"
}
{
  "_id": "p1",
  "author": "u2",
  "content": "Hello!",
  "created": ISODate("2024-03-10T18:00:00Z")
}

## 🧩 Indexing Suggestions

- `users._id` — default, for lookups.
- Compound index on `posts`:
  ```js
  { author: 1, created: -1 }
