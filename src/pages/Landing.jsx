import { Link } from 'react-router-dom';
import { User, BookOpen, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          Welcome to Attendy <Sparkles color="var(--primary-pink-dark)" size={40} />
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          A unified, elegant platform that seamlessly integrates attendance tracking and task management for both students and teachers.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <Link to="/student" className="glass-panel" style={{ padding: '40px', width: '300px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '20px', borderRadius: '50%', color: 'var(--primary-pink-dark)' }}>
            <User size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>I am a Student</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track attendance, view safe limits, and manage assignments.</p>
          </div>
          <span className="btn-primary" style={{ marginTop: 'auto' }}>Enter Dashboard</span>
        </Link>
        
        <Link to="/teacher" className="glass-panel" style={{ padding: '40px', width: '300px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '20px', borderRadius: '50%', color: 'var(--primary-pink-dark)' }}>
            <BookOpen size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>I am a Teacher</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mark attendance easily, monitor defaulters, and analyze trends.</p>
          </div>
          <span className="btn-primary" style={{ marginTop: 'auto' }}>Enter Dashboard</span>
        </Link>
        
      </div>
    </div>
  );
}
