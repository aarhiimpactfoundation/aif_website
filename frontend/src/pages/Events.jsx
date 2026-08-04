import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CalendarBlank, 
  Tag, 
  ArrowRight,
  MagnifyingGlass
} from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const categories = [
  { id: 'all', name: 'All Updates' },
  { id: 'workshop', name: 'Workshops' },
  { id: 'field-work', name: 'Field Work' },
  { id: 'partnership', name: 'Partnerships' },
  { id: 'research', name: 'Research' }
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await axios.get(`${API}/events${params}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
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

  return (
    <div className="page-transition pt-20" data-testid="events-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Events & Updates
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Latest News & Activities
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Stay updated with our workshops, field activities, partnerships, and research initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-[#2D6A6A] text-white' 
                    : 'bg-[#F1EFE9] text-[#1B4332] hover:bg-[#E6E4DD]'
                  }`}
                data-testid={`filter-${category.id}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-[#F1EFE9]" data-testid="events-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-manrope text-xl font-semibold text-[#1B4332] mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Check back soon for updates on our activities.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="event-card bg-white rounded-sm overflow-hidden group"
                  data-testid={`event-card-${index}`}
                >
                  <div className="image-zoom h-48 overflow-hidden">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2D6A6A] flex items-center justify-center">
                        <CalendarBlank size={48} className="text-white/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center text-xs text-gray-500">
                        <Tag size={14} className="mr-1" />
                        {getCategoryLabel(event.category)}
                      </span>
                      {event.event_date && (
                        <span className="flex items-center text-xs text-gray-500">
                          <CalendarBlank size={14} className="mr-1" />
                          {formatDate(event.event_date)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-manrope text-lg font-semibold text-[#1B4332] mb-2 line-clamp-2 group-hover:text-[#2D6A6A] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {event.description}
                    </p>
                    <Link 
                      to={`/events/${event.id}`}
                      className="text-[#2D6A6A] text-sm font-medium inline-flex items-center hover:text-[#1B4332] transition-colors"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-2xl md:text-3xl font-bold text-[#1B4332] mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-600 mb-4">
            Follow us on social media or contact us directly for updates on our activities.
          </p>
          <p className="text-[#2D6A6A] font-medium">
            info@aarhiimpactfoundation.org
          </p>
        </div>
      </section>
    </div>
  );
}
