import Student from '../models/Student.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import Score from '../models/Score.js';
import Timetable from '../models/Timetable.js';
import ExamTimetable from '../models/ExamTimetable.js';

export const getStudentDashboardService = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) throw new Error('Student profile missing');

  const scores = await Score.find({ studentId: student._id }).sort('-createdAt').limit(5);
  const attendance = await Attendance.find({ studentId: student._id }).sort('-date').limit(30);

  return {
    student,
    latestScores: scores,
    attendanceTrend: attendance
  };
};

export const getAssignmentsService = async (userId) => {
  const student = await Student.findOne({ userId });
  return Assignment.find({ classId: student.classId }).sort('dueDate');
};

export const getAttendanceService = async (userId) => {
  const student = await Student.findOne({ userId });
  return Attendance.find({ studentId: student._id }).sort('-date');
};

export const getStudentTimetableService = async (userId) => {
  const student = await Student.findOne({ userId }).populate('classId', 'name session term arm');
  if (!student) throw new Error('Student profile missing');

  const [classTimetable, examTimetable] = await Promise.all([
    Timetable.findOne({ classId: student.classId }).sort('-updatedAt').lean(),
    ExamTimetable.findOne({ classId: student.classId }).sort('-updatedAt').lean()
  ]);

  return {
    classTimetable,
    examTimetable
  };
};
