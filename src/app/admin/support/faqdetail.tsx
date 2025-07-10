import React, { useState, useEffect } from 'react';
import {
  User,
  Tag,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  ArrowLeft,
  Share2,
  Printer,
  MessageCircle,
  AlertTriangle,
  Loader,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import supportService from '../../../api/services/support';

const FaqDetailPage = () => {
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const [userFeedback, setUserFeedback] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const fetchFaqDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supportService.getFAQById(id);
      if (response.success && response.data.faq) {
        setFaq(response.data.faq);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch FAQ details', err);
      setError('Unable to load FAQ details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (faqId, isHelpful) => {
    try {
      const response = await supportService.submitFAQFeedback(faqId, isHelpful);
      return response;
    } catch (err) {
      console.error('Error submitting feedback', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFaqDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFeedback = async (isHelpful) => {
    if (userFeedback !== null || submittingFeedback) {
      return;
    }

    setSubmittingFeedback(true);

    try {
      await submitFeedback(faq.id, isHelpful);

      setFaq(prev => ({
        ...prev,
        helpfulCount: isHelpful ? prev.helpfulCount + 1 : prev.helpfulCount,
        notHelpfulCount: !isHelpful ? prev.notHelpfulCount + 1 : prev.notHelpfulCount
      }));

      setUserFeedback(isHelpful);
      setFeedbackSuccess(true);

      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: faq?.question,
        text: faq?.question,
        url: window.location.href
      })
        .catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy link', err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 flex justify-center items-center">
            <Loader className="h-8 w-8 text-teal-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading FAQ details...</span>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={fetchFaqDetails}
              className="mt-2 text-sm text-teal-600 hover:text-teal-800 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500">FAQ not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to FAQ List</span>
          </button>
        </div>

        {/* Main FAQ card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          {/* Header with category */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: `${faq.category.color}15` }}
              >
                <User className="h-5 w-5" style={{ color: faq.category.color }} />
              </div>
              <span
                className="text-sm font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${faq.category.color}15`,
                  color: faq.category.color
                }}
              >
                {faq.category.name}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{faq.question}</h1>
          </div>

          {/* Answer section */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p>{faq.answer}</p>
            </div>

            {/* Tags */}
            {faq.tags && faq.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {faq.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Feedback and metadata section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{faq.viewCount} views</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Updated {formatDate(faq.updatedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Print this FAQ"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Share this FAQ"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Feedback section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Was this helpful?</h3>

            {feedbackSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-800">
                Thank you for your feedback!
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleFeedback(true)}
                disabled={userFeedback !== null || submittingFeedback}
                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm ${userFeedback === true
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${(userFeedback !== null || submittingFeedback) && userFeedback !== true ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsUp className="h-4 w-4 mr-1.5" />
                Yes
                {faq.helpfulCount > 0 && <span className="ml-1.5 text-xs text-gray-500">({faq.helpfulCount})</span>}
              </button>

              <button
                onClick={() => handleFeedback(false)}
                disabled={userFeedback !== null || submittingFeedback}
                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm ${userFeedback === false
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${(userFeedback !== null || submittingFeedback) && userFeedback !== false ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsDown className="h-4 w-4 mr-1.5" />
                No
                {faq.notHelpfulCount > 0 && <span className="ml-1.5 text-xs text-gray-500">({faq.notHelpfulCount})</span>}
              </button>

              {submittingFeedback && (
                <span className="text-sm text-gray-500 flex items-center">
                  <Loader className="animate-spin h-3 w-3 mr-1" />
                  Submitting...
                </span>
              )}
            </div>

            {userFeedback === false && (
              <div className="mt-4">
                <button
                  className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  Contact support for more help
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqDetailPage;
