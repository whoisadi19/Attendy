import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [totalClasses, setTotalClasses] = useState(10);
  const [students, setStudents] = useState([
    { roll: 'E288', name: 'Yashika Bante', attended: 8, points: 1250 },
    { roll: 'E278', name: 'Sonishka Gupta', attended: 9, points: 1400 },
    { roll: 'E287', name: 'Dhvani Khandelwal', attended: 8, points: 1300 },
    { roll: 'E101', name: 'John Doe', attended: 6, points: 800 },
    { roll: 'E102', name: 'Jane Smith', attended: 5, points: 650 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Data Structures Project', due: 'Today, 11:59 PM', completedBy: [] },
    { id: 2, title: 'Operating Systems Lab', due: 'Friday, 5:00 PM', completedBy: ['E278', 'E287'] }
  ]);

  const getAttendancePercentage = (attended) => {
    return totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);
  };

  const determineStatus = (percentage) => {
    return percentage >= 75 ? 'safe' : 'defaulter';
  };

  const markDailyAttendance = (attendanceMap) => {
    setTotalClasses(prev => prev + 1);
    setStudents(prevStudents => prevStudents.map(student => {
      // If student is present in the map, consider true, else false.
      const isPresent = attendanceMap[student.roll] || false;
      return {
        ...student,
        attended: isPresent ? student.attended + 1 : student.attended,
        points: isPresent ? student.points + 50 : student.points
      };
    }));
  };

  const importStudentsFromCSV = (parsedData) => {
    // Assuming CSV headers: RollNo, Name, Attended
    const validRows = parsedData.filter(row => row.RollNo && row.Name);
    if (validRows.length > 0) {
      const newStudents = validRows.map(row => ({
        roll: row.RollNo.trim(),
        name: row.Name.trim(),
        attended: parseInt(row.Attended) || 0,
        points: 500
      }));
      
      // Merge, avoid exact duplicates if possible
      setStudents(prev => {
        const existingRolls = new Set(prev.map(s => s.roll));
        const filteredNew = newStudents.filter(s => !existingRolls.has(s.roll));
        return [...prev, ...filteredNew];
      });
    }
  };

  const addTask = (title, due) => {
    setTasks(prev => [...prev, { id: Date.now(), title, due, completedBy: [] }]);
  };

  const toggleTaskCompletion = (taskId, rollNo) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const isCompleted = task.completedBy.includes(rollNo);
        return {
          ...task,
          completedBy: isCompleted 
            ? task.completedBy.filter(r => r !== rollNo) 
            : [...task.completedBy, rollNo]
        };
      }
      return task;
    }));
  };

  return (
    <AppContext.Provider value={{
      totalClasses,
      students,
      tasks,
      getAttendancePercentage,
      determineStatus,
      markDailyAttendance,
      importStudentsFromCSV,
      addTask,
      toggleTaskCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
}
