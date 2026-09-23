const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  chapters: [
    {
      title: String,
      materialUrl: String,
      materialType: {
        type: String,
        enum: ['document', 'video', 'presentation'],
      },
    },
  ],
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);