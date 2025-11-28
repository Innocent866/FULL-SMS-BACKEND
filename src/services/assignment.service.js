import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';

export const listAssignmentsService = async (user) => {
  if (user.role === 'teacher') {
    return Assignment.find({ postedBy: user.id }).sort('-createdAt');
  }
  if (user.role === 'student' || user.role === 'parent') {
    const student = user.role === 'student' ? await Student.findOne({ userId: user.id }) : null;
    const classId = student?.classId;
    return Assignment.find({ classId }).sort('dueDate');
  }
  return Assignment.find().sort('-createdAt');
};

export const createAssignmentService = async (payload) => Assignment.create(payload);

export const submitAssignmentService = async ({ assignmentId, userId, payload }) => {
  const student = await Student.findOne({ userId });
  return Assignment.findByIdAndUpdate(
    assignmentId,
    {
      $push: {
        submissions: {
          studentId: student._id,
          submittedAt: new Date(),
          attachments: payload.attachments,
          grade: payload.grade,
          feedback: payload.feedback
        }
      }
    },
    { new: true }
  );
};
