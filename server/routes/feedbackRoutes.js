const router = require('express').Router();
const Feedback = require('../models/Feedback');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Student submits feedback for a course
router.post('/', protect, requireRole('student'), async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    const feedback = await Feedback.create({
      student: req.user.id,
      course: courseId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Anyone logged in can view feedback for a specific course
router.get('/:courseId', protect, async (req, res) => {
  try {
    const feedback = await Feedback.find({ course: req.params.courseId })
      .populate('student', 'name');
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;