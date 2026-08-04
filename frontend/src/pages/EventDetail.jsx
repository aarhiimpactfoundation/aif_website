import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarBlank, 
  Tag, 
  ArrowLeft,
  ShareNetwork
} from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const categories = [
  { id: 'workshop', name: 'Workshops' },
  { id: 'field-work', name: 'Field Work' },
  { id: 'partnership', name: 'Partnerships' },
  { id: 'research', name: 'Research' }
];

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API}/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getCategoryLabel = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1EFE9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D6A6A]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F1EFE9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary inline-flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFE9]" data-testid="event-detail-page">
      {/* Hero Image */}
      {event.image_url && (
        <div className="w-full h-64 md:h-96 relative">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Back Button */}
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center text-[#2D6A6A] hover:text-[#1B4332] mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </button>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-[#2D6A6A]/10 text-[#2D6A6A] rounded-full text-sm">
              <Tag size={14} className="mr-1" />
              {getCategoryLabel(event.category)}
            </span>
            {event.event_date && (
              <span className="flex items-center text-gray-500 text-sm">
                <CalendarBlank size={16} className="mr-1" />
                {formatDate(event.event_date)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-manrope text-3xl md:text-4xl font-bold text-[#1B4332] mb-6">
            {event.title}
          </h1>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center text-[#2D6A6A] hover:text-[#1B4332] mb-8 transition-colors"
          >
            <ShareNetwork size={20} className="mr-2" />
            Share this event
          </button>

          {/* Content */}
          <div className="bg-white rounded-sm p-8 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {event.description}
              </p>
              {event.content && (
                <div 
                  className="text-gray-600 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: event.content.replace(/\n/g, '<br/>') }}
                />
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Interested in our work?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">
                Contact Us
              </Link>
              <Link to="/donate" className="btn-outline">
                Support Our Mission
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
