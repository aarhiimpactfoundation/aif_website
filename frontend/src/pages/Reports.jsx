import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FilePdf, 
  DownloadSimple, 
  Eye,
  FolderOpen,
  CalendarBlank,
  X
} from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// Document categories
const categories = [
  { id: 'all', name: 'All Documents' },
  { id: 'annual', name: 'Annual Reports' },
  { id: 'financial', name: 'Financial Statements' },
  { id: 'impact', name: 'Impact Reports' },
  { id: 'legal', name: 'Legal Documents' }
];

// Convert Google Drive sharing link to preview link
const convertGoogleDriveLink = (url) => {
  if (!url) return url;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

// Convert to download link
const convertToDownloadLink = (url) => {
  if (!url) return url;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewingPdf, setViewingPdf] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API}/reports`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'annual': return '#1B4332';
      case 'financial': return '#2D6A6A';
      case 'impact': return '#C2A878';
      case 'legal': return '#64748B';
      default: return '#1B4332';
    }
  };

  const handleView = (doc) => {
    if (doc.pdf_url) {
      setViewingPdf({...doc, pdf_url: convertGoogleDriveLink(doc.pdf_url)});
    } else {
      alert('PDF will be available soon. Please check back later.');
    }
  };

  const handleDownload = (doc) => {
    if (doc.pdf_url) {
      window.open(convertToDownloadLink(doc.pdf_url), '_blank');
    } else {
      alert('PDF will be available soon. Please check back later.');
    }
  };

  return (
    <div className="page-transition pt-20" data-testid="reports-page">
      {/* Hero Section */}
      <section className="bg-[#1B4332] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="text-[#C2A878] text-sm font-semibold tracking-widest uppercase">
              Transparency & Accountability
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Reports & Documents
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Access our annual reports, audited financials, impact assessments, and organizational 
              documents. We believe in complete transparency with our stakeholders.
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

      {/* Documents Grid */}
      <section className="section-padding bg-[#F1EFE9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-manrope text-xl font-semibold text-[#1B4332]">
                No documents in this category
              </h3>
              <p className="text-gray-500 mt-2">Documents will be uploaded soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                  data-testid={`doc-card-${doc.id}`}
                >
                  {/* PDF Icon Header */}
                  <div 
                    className="h-40 flex items-center justify-center relative"
                    style={{ backgroundColor: `${getCategoryColor(doc.category)}10` }}
                  >
                    <div className="relative">
                      <FilePdf 
                        size={80} 
                        weight="duotone"
                        className="transition-transform group-hover:scale-110"
                        style={{ color: getCategoryColor(doc.category) }}
                      />
                      <div 
                        className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded text-xs font-bold"
                        style={{ color: getCategoryColor(doc.category) }}
                      >
                        PDF
                      </div>
                    </div>
                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-[#1B4332] shadow-sm">
                      {doc.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${getCategoryColor(doc.category)}15`,
                          color: getCategoryColor(doc.category)
                        }}
                      >
                        {categories.find(c => c.id === doc.category)?.name || doc.category}
                      </span>
                    </div>
                    
                    <h3 className="font-manrope text-lg font-semibold text-[#1B4332] mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {doc.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={14} />
                        {doc.upload_date}
                      </span>
                      <span>{doc.file_size}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D6A6A] text-white text-sm font-medium rounded-sm hover:bg-[#1B4332] transition-colors"
                        data-testid={`view-btn-${doc.id}`}
                      >
                        <Eye size={18} />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#2D6A6A] text-[#2D6A6A] text-sm font-medium rounded-sm hover:bg-[#2D6A6A] hover:text-white transition-colors"
                        data-testid={`download-btn-${doc.id}`}
                      >
                        <DownloadSimple size={18} />
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-manrope text-2xl font-bold text-[#1B4332] mb-4">
            Need a Specific Document?
          </h2>
          <p className="text-gray-600 mb-6">
            If you need any document that is not listed here, or require certified copies 
            for due diligence purposes, please contact us.
          </p>
          <a 
            href="mailto:info@aarhiimpactfoundation.org?subject=Document Request"
            className="btn-primary inline-flex items-center"
          >
            Request Documents
          </a>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-manrope font-semibold text-[#1B4332]">{viewingPdf.title}</h3>
              <button 
                onClick={() => setViewingPdf(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4">
              {viewingPdf.pdf_url ? (
                <iframe 
                  src={viewingPdf.pdf_url}
                  className="w-full h-full rounded-sm"
                  title={viewingPdf.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-sm">
                  <div className="text-center">
                    <FilePdf size={80} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">PDF will be available soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
