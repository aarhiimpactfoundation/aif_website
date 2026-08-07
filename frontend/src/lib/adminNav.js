import {
  House,
  CalendarBlank,
  Envelope,
  Users,
  ChartLine,
  FileText,
  HandCoins,
  UserGear,
  Quotes
} from '@phosphor-icons/react';

// Centralized admin sidebar so every admin page shows the same links,
// filtered by the logged-in user's role. Managers get Events/Reports/
// Donations/Testimonials; Contacts, Applications, and Users stay admin-only.
export function getSidebarLinks(role) {
  const links = [
    { name: 'Dashboard', path: '/admin', icon: House, roles: ['admin', 'manager'] },
    { name: 'Events', path: '/admin/events', icon: CalendarBlank, roles: ['admin', 'manager'] },
    { name: 'Reports', path: '/admin/reports', icon: FileText, roles: ['admin', 'manager'] },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quotes, roles: ['admin', 'manager'] },
    { name: 'Donations', path: '/admin/donations', icon: HandCoins, roles: ['admin', 'manager'] },
    { name: 'Contact Messages', path: '/admin/contacts', icon: Envelope, roles: ['admin'] },
    { name: 'Applications', path: '/admin/internships', icon: Users, roles: ['admin'] },
    { name: 'Manage Users', path: '/admin/users', icon: UserGear, roles: ['admin'] },
  ];
  return links.filter(link => link.roles.includes(role));
}

export function getCurrentAdmin() {
  try {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
