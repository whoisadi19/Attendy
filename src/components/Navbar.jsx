import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, LayoutDashboard, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="top-nav glass-panel">
      <Link to="/" className="brand-title">
        <CalendarCheck size={28} color="var(--primary-pink-dark)" />
        <span>Attendy</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        {location.pathname !== '/' && (
          <Link to="/" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            Home
          </Link>
        )}
      </div>
    </nav>
  );
}
