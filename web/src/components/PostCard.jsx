import React from 'react';
import { useAuth } from '../context/AuthContext';

const PostCard = React.memo(({ post, onDelete }) => {
  const { user, token } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      onDelete?.(post._id);
    } else {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="post-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className="post-author"><strong>{post.author}</strong></p>
        {user?.role === 'admin' && (
          <button className="delete-button" onClick={handleDelete}>🗑️</button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      <p className="post-date">{new Date(post.created).toLocaleString()}</p>
    </div>
  );
});

export default PostCard;
