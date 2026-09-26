import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

function AdminHome() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axiosInstance.post('/courses', { courseName, description });
      setMessage('Course added successfully!');
      setCourseName('');
      setDescription('');
      fetchCourses(); // refresh the list to show the new course
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add course');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Welcome, {name} (Admin)</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Add a New Course</h3>
      <form onSubmit={handleAddCourse}>
        <div>
          <label>Course Name</label><br />
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Description</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <br />
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Add Course</button>
      </form>

      <h3>All Courses</h3>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.courseName}</strong>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminHome;