import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/student/StudentHome';
import AdminHome from './pages/admin/AdminHome';
import FacultyHome from './pages/faculty/FacultyHome';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student"
          element={<ProtectedRoute allowedRole="student"><StudentHome /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRole="admin"><AdminHome /></ProtectedRoute>}
        />
        <Route
          path="/faculty"
          element={<ProtectedRoute allowedRole="faculty"><FacultyHome /></ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;