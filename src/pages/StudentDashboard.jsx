import React, { useContext } from 'react';
import { Award, Target, AlertTriangle, Book, Calendar, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function StudentDashboard() {
  const { students, totalClasses, getAttendancePercentage, determineStatus, tasks, toggleTaskCompletion } = useContext(AppContext);
  
  // Mock logged-in student (using the first student in the list for MVP)
  const myData = students[0]; 
  
  const pct = getAttendancePercentage(myData?.attended || 0);
  const status = determineStatus(pct);
  
  // Calculate risk indicator (How many classes can be missed safely?)
  // (attended) / (totalClasses + x) >= 0.75
  // x <= (attended / 0.75) - totalClasses
  const classesCanMissSafely = Math.floor((myData?.attended / 0.75) - totalClasses);
  const safeMisses = Math.max(0, classesCanMissSafely);

  const subjectData = [
    { subject: 'Data Structures (Core)', attended: myData?.attended || 0, total: totalClasses, percentage: pct },
  ];

  if (!myData) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', background: 'var(--primary-gradient)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Welcome back, {myData.name.split(' ')[0]}! 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Roll No: {myData.roll} | Keep pushing forward!</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, display: 'block' }}>{myData.points}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</span>
          </div>
          <Award size={48} color="var(--primary-pink-dark)" />
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Stats & Risk */}
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-label">Overall Attendance</span>
                <Target size={24} color="var(--primary-pink-dark)" />
              </div>
              <span className="stat-value">{pct}%</span>
              <div style={{ width: '100%', height: '8px', background: '#fce7f3', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-gradient)', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `4px solid ${safeMisses > 0 ? '#10b981' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-label">Risk Indicator</span>
                <AlertTriangle size={24} color={safeMisses > 0 ? '#10b981' : '#f59e0b'} />
              </div>
              <span className="stat-value" style={{ color: safeMisses > 0 ? '#059669' : '#d97706' }}>
                {safeMisses > 0 ? 'Safe Zone' : 'Danger Zone'}
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                You can afford to miss <strong>{safeMisses}</strong> classes. {safeMisses === 0 && 'Ensure you attend the next one.'}
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem' }}>Subject Wise Summary</h2>
            </div>
            
            <div className="item-list">
              {subjectData.map((item, idx) => (
                <div key={idx} className="item-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '10px', background: 'var(--primary-gradient)', borderRadius: '12px', color: 'var(--primary-pink-dark)' }}>
                      <Book size={20} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, display: 'block' }}>{item.subject}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.attended} / {item.total} Attended</span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${item.percentage >= 75 ? 'badge-pink' : 'badge-danger'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Tasks & Reminders */}
        <div className="col-span-4 glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={20} color="var(--primary-pink-dark)" />
              <h2 style={{ fontSize: '1.2rem' }}>Pending Tasks</h2>
            </div>
            <div className="item-list">
              {tasks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No pending tasks!</p>
              ) : (
                tasks.map(task => {
                  const isCompleted = task.completedBy.includes(myData.roll);
                  return (
                    <div key={task.id} className="item-row" style={{ padding: '12px', background: isCompleted ? '#dcfce7' : '#fef2f2', border: isCompleted ? '1px solid #bbf7d0' : '1px solid #fee2e2' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', color: isCompleted ? '#166534' : '#991b1b', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                          {task.title}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: isCompleted ? '#15803d' : '#b91c1c' }}>Due {task.due}</span>
                      </div>
                      <div 
                        onClick={() => toggleTaskCompletion(task.id, myData.roll)}
                        style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          border: isCompleted ? 'none' : '2px solid #fca5a5', 
                          background: isCompleted ? '#22c55e' : 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}
                      >
                        {isCompleted && <CheckCircle2 size={16} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)'}} />

          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircle2 size={20} color="var(--primary-pink-dark)" />
              <h2 style={{ fontSize: '1.2rem' }}>Smart Milestones</h2>
            </div>
            <div style={{ background: 'var(--primary-gradient)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
               <Award size={32} color="var(--primary-pink-dark)" style={{ margin: '0 auto 8px' }} />
               <strong style={{ display: 'block' }}>Attendance Champion</strong>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Keep attending to earn your next badge!</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
