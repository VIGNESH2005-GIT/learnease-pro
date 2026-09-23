const router = require('express').Router();
const Course = require('../models/Course');
const { protect, requireRole } = require('../middleware/authMiddleware');

// GET all courses — any logged-in user (admin, faculty, student) can view
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new course — only admin can add
router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { courseName, description, faculty } = req.body;
    const course = await Course.create({ courseName, description, faculty });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (update) a course — only faculty can update
router.put('/:id', protect, requireRole('faculty'), async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;