import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import CommentList from '../Comment/CommentList';
import CommentForm from '../Comment/CommentForm';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Post not found</div>;

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="post-detail">
      <article className="post-content">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
            className="post-detail-image"
          />
        )}
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author.name}</span>
          <span>{post.category.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-body">{post.content}</div>
        
        {isAuthor && (
          <div className="post-actions">
            <Link to={`/edit-post/${post._id}`} className="btn-edit">
              Edit Post
            </Link>
            <button onClick={handleDelete} className="btn-delete">
              Delete Post
            </button>
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2>Comments</h2>
        {user && <CommentForm postId={id} onCommentAdded={fetchPost} />}
        <CommentList postId={id} />
      </section>
    </div>
  );
};

export default PostDetail;