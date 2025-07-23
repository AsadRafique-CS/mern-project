// src/components/Feed.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from './PostCard';
import './Feed.css';

const Feed = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastPostRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feed?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const newPosts = data.filter(post => !existingIds.has(post._id));
        return [...prev, ...newPosts];
      });

      setHasMore(data.length === 10);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="feed-wrapper">
      <h2 className="feed-title">Feed</h2>
      <div className="post-list">
        {posts.map((post, idx) => {
          const card = (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          );
          return idx === posts.length - 1
            ? <div ref={lastPostRef} key={post._id}>{card}</div>
            : card;
        })}
      </div>

      {loading && <p className="feed-loading">Loading...</p>}
      {!hasMore && !loading && <p className="feed-end">No more posts.</p>}
    </div>
  );
};

export default Feed;
