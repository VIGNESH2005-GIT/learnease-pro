const router = require('express').Router();
const CourseRequest = require('../models/CourseRequest');
const Course = require('../models/Course');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Student requests access to a course
router.post('/', protect, requireRole('student'), async (req, res) => {
  try {
    const { courseId } = req.body;

    const existing = await CourseRequest.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (existing) {
      return res.status(400).json({ error: 'Request already exists for this course' });
    }

    const request = await CourseRequest.create({
      student: req.user.id,
      course: courseId,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin views all requests
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const requests = await CourseRequest.find()
      .populate('student', 'name email')
      .populate('course', 'courseName');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin approves a request
router.put('/:id/approve', protect, requireRole('admin'), async (req, res) => {
  try {
    const request = await CourseRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // also add the student to the course's enrolledStudents list
    await Course.findByIdAndUpdate(request.course, {
      $addToSet: { enrolledStudents: request.student },
    });

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;