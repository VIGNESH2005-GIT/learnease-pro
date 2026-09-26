const router = require('express').Router();
const Course = require('../models/Course');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { courseName, description, faculty } = req.body;
    const course = await Course.create({ courseName, description, faculty });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// Upload learning material to a course (faculty or admin)
router.post(
  '/:id/upload',
  protect,
  upload.single('material'),
  async (req, res) => {
    try {
      if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { title, materialType } = req.body;

      const course = await Course.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            chapters: {
              title,
              materialType,
              materialUrl: `/uploads/${req.file.filename}`,
            },
          },
        },
        { new: true }
      );

      if (!course) return res.status(404).json({ error: 'Course not found' });

      res.status(200).json(course);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;