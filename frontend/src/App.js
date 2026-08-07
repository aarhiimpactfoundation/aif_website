import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Impact from "@/pages/Impact";
import Events from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import EventDetail from "@/pages/EventDetail";
import Internships from "@/pages/Internships";
import Donate from "@/pages/Donate";
import Contact from "@/pages/Contact";
import CSRPartnership from "@/pages/CSRPartnership";
import Reports from "@/pages/Reports";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import TermsConditions from "@/pages/legal/TermsConditions";
import RefundPolicy from "@/pages/legal/RefundPolicy";
import Governance from "@/pages/legal/Governance";

// Admin
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminReports from "@/pages/admin/AdminReports";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminInternships from "@/pages/admin/AdminInternships";
import AdminDonations from "@/pages/admin/AdminDonations";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminUsers from "@/pages/admin/AdminUsers";

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
          <Route path="/impact" element={<PublicLayout><Impact /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/events/:eventId" element={<PublicLayout><EventDetail /></PublicLayout>} />
          <Route path="/internships" element={<PublicLayout><Internships /></PublicLayout>} />
          <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
          <Route path="/csr-partnership" element={<PublicLayout><CSRPartnership /></PublicLayout>} />
          <Route path="/reports" element={<PublicLayout><Reports /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/terms-conditions" element={<PublicLayout><TermsConditions /></PublicLayout>} />
          <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          <Route path="/governance" element={<PublicLayout><Governance /></PublicLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/internships" element={<AdminInternships />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
