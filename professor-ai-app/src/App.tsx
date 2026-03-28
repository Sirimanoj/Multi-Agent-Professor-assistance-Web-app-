import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Login';
import ProfessorDashboard from './ProfessorDashboard';
import StudentDashboard from './StudentDashboard';
import Classrooms from './pages/Classrooms';
import Materials from './pages/Materials';
import Assignments from './pages/Assignments';
import CourseDetail from './pages/CourseDetail';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="font-body text-slate-800 bg-background min-h-screen selection:bg-violet-600/20">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Home Redirect */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? <ProfessorDashboard /> : <StudentDashboard />}
            </ProtectedRoute>
          } 
        />
        
        {/* Universal Sub-Pages */}
        <Route path="/classrooms" element={<ProtectedRoute><Classrooms /></ProtectedRoute>} />
        <Route path="/classrooms/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
