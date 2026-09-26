import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

function FacultyHome() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [uploadCourseId, setUploadCourseId] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState('document');
  const [file, setFile] = useState(null);

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

  const startEditing = (course) => {
    setEditingId(course._id);
    setEditName(course.courseName);
    setEditDescription(course.description || '');
    setMessage('');
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleUpdate = async (courseId) => {
    setMessage('');
    setError('');
    try {
      await axiosInstance.put(`/courses/${courseId}`, {
        courseName: editName,
        description: editDescription,
      });
      setMessage('Course updated successfully!');
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update course');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!uploadCourseId || !file) {
      setError('Select a course and a file first');
      return;
    }

    const formData = new FormData();
    formData.append('material', file);
    formData.append('title', materialTitle);
    formData.append('materialType', materialType);

    try {
      await axiosInstance.post(`/courses/${uploadCourseId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Material uploaded successfully!');
      setMaterialTitle('');
      setFile(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Welcome, {name} (Faculty)</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Upload Learning Material</h3>
      <form onSubmit={handleUpload}>
        <div>
          <label>Course</label><br />
          <select value={uploadCourseId} onChange={(e) => setUploadCourseId(e.target.value)} required>
            <option value="">-- Select a course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label>Material Title</label><br />
          <input type="text" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} required />
        </div>
        <br />
        <div>
          <label>Material Type</label><br />
          <select value={materialType} onChange={(e) => setMaterialType(e.target.value)}>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="presentation">Presentation</option>
          </select>
        </div>
        <br />
        <div>
          <label>File</label><br />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>All Courses</h3>
      <ul>
        {courses.map((course) => (
          <li key={course._id} style={{ marginBottom: '15px' }}>
            {editingId === course._id ? (
              <div>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <br />
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <br />
                <button onClick={() => handleUpdate(course._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{course.courseName}</strong>
                <p>{course.description}</p>
                <button onClick={() => startEditing(course)}>Edit</button>

                {course.chapters && course.chapters.length > 0 && (
                  <ul>
                    {course.chapters.map((ch, idx) => (
                      <li key={idx}>
                        {ch.title} ({ch.materialType}) —{' '}
                        <a href={`http://localhost:5000${ch.materialUrl}`} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacultyHome;