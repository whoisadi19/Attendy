import React, { useContext, useState, useRef } from 'react';
import { Users, TrendingUp, AlertOctagon, Upload, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';

export default function TeacherDashboard() {
  const { students, tasks, addTask, getAttendancePercentage, determineStatus, importStudentsFromCSV, markDailyAttendance } = useContext(AppContext);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const fileInputRef = useRef(null);

  // Compute stats
  const totalStudents = students.length;
  let defaultersCount = 0;
  let sumPercentage = 0;

  const rosterData = students.map(s => {
    const pct = getAttendancePercentage(s.attended);
    const status = determineStatus(pct);
    if (status === 'defaulter') defaultersCount++;
    sumPercentage += pct;
    return { ...s, percentage: pct, status };
  });

  const overallClassAttendance = totalStudents === 0 ? 0 : Math.round(sumPercentage / totalStudents);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          importStudentsFromCSV(results.data);
        }
      });
    }
  };

  const openAttendanceModal = () => {
    // default all true
    const draft = {};
    students.forEach(s => draft[s.roll] = true);
    setAttendanceDraft(draft);
    setIsModalOpen(true);
  };

  const toggleDraft = (roll) => {
    setAttendanceDraft(prev => ({ ...prev, [roll]: !prev[roll] }));
  };

  const saveAttendance = () => {
    markDailyAttendance(attendanceDraft);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>CS-B1 Dashboard</h1>
           <p style={{ color: 'var(--text-muted)' }}>Overview & Management</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
            <Upload size={18} />
            Bulk Import CSV
          </button>
          <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

          <button className="btn-primary" onClick={openAttendanceModal}>
            <CheckCircle size={18} />
            Mark Today's Attendance
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Top metrics */}
        <div className="col-span-4 glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--primary-gradient)', borderRadius: '16px', color: 'var(--primary-pink-dark)' }}>
            <Users size={32} />
          </div>
          <div>
            <span className="stat-label">Total Students</span>
            <span className="stat-value" style={{ display: 'block', fontSize: '2rem' }}>{totalStudents}</span>
          </div>
        </div>

        <div className="col-span-4 glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '16px', color: '#166534' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <span className="stat-label">Avg. Class Attendance</span>
            <span className="stat-value" style={{ display: 'block', fontSize: '2rem', color: '#166534' }}>{overallClassAttendance}%</span>
          </div>
        </div>

        <div className="col-span-4 glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ padding: '16px', background: '#fee2e2', borderRadius: '16px', color: '#991b1b' }}>
            <AlertOctagon size={32} />
          </div>
          <div>
            <span className="stat-label">Defaulters (&lt; 75%)</span>
            <span className="stat-value" style={{ display: 'block', fontSize: '2rem', color: '#991b1b' }}>{defaultersCount}</span>
          </div>
        </div>

        {/* Task Tracking Panel */}
        <div className="col-span-12 glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Task Management</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Task Title" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <input 
                type="text" 
                placeholder="Due (e.g. tmrw 5pm)" 
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <button 
                className="btn-primary" 
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => {
                  if(newTaskTitle && newTaskDue) {
                    addTask(newTaskTitle, newTaskDue);
                    setNewTaskTitle('');
                    setNewTaskDue('');
                  }
                }}
              >
                Add Task
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {tasks.map(task => {
               const progressPct = totalStudents === 0 ? 0 : Math.round((task.completedBy.length / totalStudents) * 100);
               return (
                 <div key={task.id} style={{ background: '#faf8fa', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                     <div>
                       <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-main)' }}>{task.title}</span>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due {task.due}</span>
                     </div>
                   </div>
                   <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                       <span>{task.completedBy.length} / {totalStudents} Completed</span>
                       <span style={{ fontWeight: 600 }}>{progressPct}%</span>
                     </div>
                     <div style={{ width: '100%', height: '6px', background: '#fce7f3', borderRadius: '3px' }}>
                       <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--primary-pink-dark)', borderRadius: '3px', transition: 'width 0.3s' }}></div>
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="col-span-12 glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Student Roster & Analytics</h2>
          
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Roll No</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Attendance %</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rosterData.map((student, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e=> e.currentTarget.style.background='white'} onMouseOut={e=> e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{student.roll}</td>
                    <td style={{ padding: '16px' }}>{student.name}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{student.percentage}%</span>
                        <div style={{ flex: 1, height: '6px', background: '#fce7f3', borderRadius: '3px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '3px', width: `${student.percentage}%`, background: student.status === 'safe' ? '#ec4899' : '#ef4444' }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${student.status === 'safe' ? 'badge-pink' : 'badge-danger'}`}>
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Daily Attendance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {students.map(s => (
            <div key={s.roll} className="item-row" style={{ padding: '12px', background: attendanceDraft[s.roll] ? '#fce7f3' : '#fef2f2' }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 600 }}>{s.roll} - {s.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently {s.attended} classes attended</span>
              </div>
              <div>
                <button 
                  onClick={() => toggleDraft(s.roll)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: attendanceDraft[s.roll] ? '#ec4899' : '#f87171',
                    color: 'white'
                  }}
                >
                  {attendanceDraft[s.roll] ? 'Present' : 'Absent'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={saveAttendance}>Save Attendance</button>
        </div>
      </Modal>

    </div>
  );
}
