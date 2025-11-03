import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, postsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const OnboardingGuide = () => {
  const { user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [hasPosts, setHasPosts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkProgress();
    }
  }, [user]);

  const checkProgress = async () => {
    try {
      const categoriesRes = await categoriesAPI.getCategories();
      const postsRes = await postsAPI.getPosts({ limit: 100 });
      
      setHasCategories(categoriesRes.data.length > 0);
      
      const userPosts = postsRes.data.posts.filter(post => post.author._id === user._id);
      setHasPosts(userPosts.length > 0);
      
      const dismissedKey = `onboarding_dismissed_${user._id}`;
      const dismissed = localStorage.getItem(dismissedKey);
      
      if (!dismissed && (categoriesRes.data.length === 0 || userPosts.length === 0)) {
        setShowGuide(true);
      }
    } catch (error) {
      console.error('Error checking progress');
    } finally {
      setLoading(false);
    }
  };

  const dismissGuide = () => {
    const dismissedKey = `onboarding_dismissed_${user._id}`;
    localStorage.setItem(dismissedKey, 'true');
    setShowGuide(false);
  };

  if (loading || !showGuide || !user) return null;

  return (
    <div className="onboarding-guide">
      <div className="onboarding-header">
        <h3>🚀 Welcome! Let's Get You Started</h3>
        <button onClick={dismissGuide} className="btn-close">×</button>
      </div>
      <div className="onboarding-steps">
        <div className={`onboarding-step ${hasCategories ? 'completed' : ''}`}>
          <div className="step-indicator">
            {hasCategories ? '✓' : '1'}
          </div>
          <div className="step-content">
            <h4>Create Your First Category</h4>
            <p>Organize your posts with categories like "Technology", "Lifestyle", or "Travel"</p>
            {!hasCategories && (
              <Link to="/categories" className="btn-step">
                Create Category
              </Link>
            )}
          </div>
        </div>

        <div className={`onboarding-step ${hasPosts ? 'completed' : ''}`}>
          <div className="step-indicator">
            {hasPosts ? '✓' : '2'}
          </div>
          <div className="step-content">
            <h4>Write Your First Post</h4>
            <p>Share your thoughts, add images, and publish to the world</p>
            {!hasPosts && hasCategories && (
              <Link to="/create-post" className="btn-step">
                Write Post
              </Link>
            )}
            {!hasPosts && !hasCategories && (
              <span className="step-disabled">Complete step 1 first</span>
            )}
          </div>
        </div>

        <div className="onboarding-step">
          <div className="step-indicator">3</div>
          <div className="step-content">
            <h4>Engage with Community</h4>
            <p>Read posts, leave comments, and connect with other writers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;