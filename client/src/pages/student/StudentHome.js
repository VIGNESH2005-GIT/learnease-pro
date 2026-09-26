import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

function StudentHome() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get('/courses');
      setCourses(res.data);
    } catch (err) {
      setError('Could not load courses');
    }
  };

  const handleRequestAccess = async (courseId) => {
    setMessage('');
    setError('');
    try {
      await axiosInstance.post('/requests', { courseId });
      setMessage('Request sent successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send request');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Welcome, {name}</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Available Courses</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <ul>
        {courses.map((course) => (
          <li key={course._id} style={{ marginBottom: '15px' }}>
            <strong>{course.courseName}</strong>
            <p>{course.description}</p>
            <button onClick={() => handleRequestAccess(course._id)}>
              Request Access
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentHome;