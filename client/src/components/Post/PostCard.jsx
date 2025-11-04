import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title}
          className="post-image"
        />
      )}
      <div className="post-card-content">
        <h3>{post.title}</h3>
        <div className="post-meta">
          <span className="author">By {post.author?.name}</span>
          <span className="category">{post.category?.name}</span>
          <span className="date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="post-excerpt">
          {post.content.substring(0, 150)}...
        </p>
        <Link to={`/post/${post._id}`} className="read-more">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;