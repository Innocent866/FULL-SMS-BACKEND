import dayjs from 'dayjs';
import Student from '../models/Student.js';
import Score from '../models/Score.js';
import Attendance from '../models/Attendance.js';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Announcement from '../models/Announcement.js';
import Timetable from '../models/Timetable.js';
import ExamTimetable from '../models/ExamTimetable.js';
import LessonNote from '../models/LessonNote.js';
import Material from '../models/Material.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { ATTENDANCE_EDIT_WINDOW_HOURS } from '../utils/constants.js';

const ensureTeacher = async (userId) => {
  const teacher = await Teacher.findOne({ userId }).populate('userId');
  if (!teacher) {
    const error = new Error('Teacher profile not found');
    error.status = 404;
    throw error;
  }
  return teacher;
};

const ensureClassAccess = async (userId, classId) => {
  const [teacher, classDoc] = await Promise.all([ensureTeacher(userId), Class.findById(classId)]);
  if (!classDoc) {
    const error = new Error('Class not found');
    error.status = 404;
    throw error;
  }
  const teacherOwnsClass =
    teacher.classIds?.some((id) => id.toString() === classId.toString()) ||
    classDoc.homeroomTeacherId?.toString() === teacher._id.toString();
  if (!teacherOwnsClass) {
    const error = new Error('You are not assigned to this class');
    error.status = 403;
    throw error;
  }
  return { teacher, classDoc };
};

export const getTeacherProfileService = async (userId) => {
  const teacher = await ensureTeacher(userId);
  return {
    id: teacher._id,
    staffNo: teacher.staffNo,
    specialization: teacher.specialization,
    qualifications: teacher.qualifications,
    employmentDate: teacher.employmentDate,
    classIds: teacher.classIds,
    user: teacher.userId
  };
};

export const updateTeacherProfileService = async (userId, payload) => {
  const teacher = await ensureTeacher(userId);
  const updates = {};
  ['staffNo', 'specialization', 'qualifications', 'employmentDate'].forEach((field) => {
    if (payload[field] !== undefined) updates[field] = payload[field];
  });
  await Teacher.findByIdAndUpdate(teacher._id, updates, { new: true });
  const userUpdates = {};
  ['firstName', 'lastName', 'phone', 'avatarUrl'].forEach((field) => {
    if (payload[field] !== undefined) userUpdates[field] = payload[field];
  });
  if (payload.email) {
    userUpdates.email = payload.email.toLowerCase();
  }
  if (Object.keys(userUpdates).length) {
    await User.findByIdAndUpdate(teacher.userId._id, userUpdates, { new: true });
  }
  return getTeacherProfileService(teacherId);
};

export const updateTeacherPasswordService = async (teacherId, payload) => {
  const teacher = await ensureTeacher(teacherId);
  if (!payload.currentPassword || !payload.newPassword) {
    const error = new Error('Current and new passwords are required');
    error.status = 400;
    throw error;
  }
  const matches = await verifyPassword(teacher.userId.passwordHash, payload.currentPassword);
  if (!matches) {
    const error = new Error('Current password is incorrect');
    error.status = 400;
    throw error;
  }
  const passwordHash = await hashPassword(payload.newPassword);
  await User.findByIdAndUpdate(teacher.userId._id, { passwordHash });
  return { success: true };
};

export const listTeacherClassesService = async (userId) => {
  const teacher = await ensureTeacher(userId);

  const teacherId = teacher._id; // <-- FIXED
  const classIds = teacher.classIds ?? [];

  const classes = await Class.find({
    $or: [
      { _id: { $in: classIds } },
      { homeroomTeacherId: teacherId }
    ]
  })
    .populate('levelId', 'name')
    .populate('armId', 'name')
    .populate('sessionId', 'name');

  return classes;
};


export const listTeacherSubjectsService = async (userId) => {
  const teacher = await ensureTeacher(userId);
  const subjects = await Subject.find({ teacherIds: teacher._id });
  return subjects;
};

export const listTeacherAnnouncementsService = async (userId, filters = {}) => {
  const classes = await listTeacherClassesService(userId);
  const classIds = classes.map((cls) => cls._id);
  const query = {
    $or: [
      { audience: 'all' },
      { role: 'teacher' },
      { classId: { $in: classIds } },
      { category: 'schedule' }
    ]
  };
  if (filters.category) query.category = filters.category;
  if (filters.classId) query.classId = filters.classId;
  return Announcement.find(query).sort('-createdAt');
};

export const recordAttendanceService = async ({ teacherId, payload }) => {
  const { teacher } = await ensureClassAccess(teacherId, payload.classId);
  const entries = payload.entries ?? [];
  let count = 0;
  for (const entry of entries) {
    await Attendance.updateOne(
      { studentId: entry.studentId, date: dayjs(payload.date || new Date()).startOf('day').toDate() },
      {
        $set: {
          classId: payload.classId,
          status: entry.status,
          remarks: entry.remarks,
          recordedBy: teacher._id,
          date: dayjs(payload.date || new Date()).startOf('day').toDate()
        }
      },
      { upsert: true }
    );
    count += 1;
  }
  return { count };
};

export const updateAttendanceService = async ({ teacherId, attendanceId, updates }) => {
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    const error = new Error('Attendance record not found');
    error.status = 404;
    throw error;
  }
  await ensureClassAccess(teacherId, attendance.classId);
  const canEditUntil = dayjs(attendance.createdAt).add(ATTENDANCE_EDIT_WINDOW_HOURS, 'hour');
  if (dayjs().isAfter(canEditUntil)) {
    const error = new Error('Attendance edit window has elapsed');
    error.status = 400;
    throw error;
  }
  attendance.status = updates.status ?? attendance.status;
  attendance.remarks = updates.remarks ?? attendance.remarks;
  await attendance.save();
  return attendance;
};

export const getAttendanceHistoryService = async ({ teacherId, classId, studentId, from, to }) => {
  await ensureClassAccess(teacherId, classId);
  const query = { classId };
  if (studentId) query.studentId = studentId;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = dayjs(from).startOf('day').toDate();
    if (to) query.date.$lte = dayjs(to).endOf('day').toDate();
  }
  return Attendance.find(query)
    .populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'firstName lastName' }
    })
    .sort('-date');
};

export const getClassStudentsService = async ({ teacherId, classId }) => {
  await ensureClassAccess(teacherId, classId);
  const students = await Student.find({ classId })
    .populate('userId', 'firstName lastName email phone')
    .populate('parentIds', 'name phone email');
  return students.map((student) => ({
    id: student._id,
    name: `${student.userId?.firstName ?? ''} ${student.userId?.lastName ?? ''}`.trim(),
    email: student.userId?.email,
    phone: student.userId?.phone,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    admissionNumber: student.admissionNumber,
    parents: student.parentIds?.map((parent) => ({ id: parent._id, name: parent.name, phone: parent.phone, email: parent.email }))
  }));
};

export const uploadScoresService = async ({ teacherId, payload }) => {
  const { classId, subjectId, term, session, scores = [] } = payload;
  if (!classId || !subjectId || !term || !session) {
    const error = new Error('classId, subjectId, term and session are required');
    error.status = 400;
    throw error;
  }
  const { teacher } = await ensureClassAccess(teacherId, classId);
  const operations = scores.map((score) =>
    Score.findOneAndUpdate(
      {
        studentId: score.studentId,
        subjectId,
        classId,
        term,
        session
      },
      {
        $set: {
          teacherId: teacher._id,
          CA1: score.CA1 ?? 0,
          CA2: score.CA2 ?? 0,
          assignment: score.assignment ?? 0,
          project: score.project ?? 0,
          exam: score.exam ?? 0,
          term,
          session,
          teacherComment: score.teacherComment,
          total:
            (score.CA1 ?? 0) +
            (score.CA2 ?? 0) +
            (score.assignment ?? 0) +
            (score.project ?? 0) +
            (score.exam ?? 0)
        }
      },
      { upsert: true, new: true }
    )
  );
  const result = await Promise.all(operations);
  return { count: result.length };
};

export const downloadClassResultsService = async ({ teacherId, classId, subjectId, term, session }) => {
  if (!classId || !subjectId || !term || !session) {
    const error = new Error('classId, subjectId, term and session are required');
    error.status = 400;
    throw error;
  }
  await ensureClassAccess(teacherId, classId);
  const records = await Score.find({ classId, subjectId, term, session })
    .populate('studentId', 'admissionNumber')
    .populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'firstName lastName' }
    });
  const header = 'Admission Number,Student,CA1,CA2,Assignment,Project,Exam,Total,Remark\n';
  const rows = records
    .map((record) => {
      const studentName = `${record.studentId?.userId?.firstName ?? ''} ${record.studentId?.userId?.lastName ?? ''}`.trim();
      return [
        record.studentId?.admissionNumber ?? '',
        `"${studentName}"`,
        record.CA1 ?? 0,
        record.CA2 ?? 0,
        record.assignment ?? 0,
        record.project ?? 0,
        record.exam ?? 0,
        record.total ?? 0,
        `"${record.teacherComment ?? ''}"`
      ].join(',');
    })
    .join('\n');
  return {
    filename: `results-${classId}-${subjectId}-${term}.csv`,
    content: `${header}${rows}`
  };
};

export const listStudentPerformanceService = async ({ teacherId, classId, term, session }) => {
  if (!classId) {
    const error = new Error('classId is required');
    error.status = 400;
    throw error;
  }
  await ensureClassAccess(teacherId, classId);
  const match = { classId };
  if (term) match.term = term;
  if (session) match.session = session;
  const performance = await Score.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$studentId',
        average: { $avg: '$total' },
        subjects: { $push: { subjectId: '$subjectId', total: '$total' } }
      }
    }
  ]);
  const populated = await Student.populate(performance, [
    { path: '_id', select: 'admissionNumber gender dateOfBirth', populate: { path: 'userId', select: 'firstName lastName' } }
  ]);
  return populated.map((item) => ({
    studentId: item._id?._id,
    name: `${item._id?.userId?.firstName ?? ''} ${item._id?.userId?.lastName ?? ''}`.trim(),
    average: Number(item.average?.toFixed(2)),
    gender: item._id?.gender,
    dateOfBirth: item._id?.dateOfBirth,
    admissionNumber: item._id?.admissionNumber,
    subjects: item.subjects
  }));
};

export const uploadLessonNoteService = async ({ teacherId, payload }) => {
  const { teacher } = await ensureClassAccess(teacherId, payload.classId);
  const note = await LessonNote.create({
    ...payload,
    teacherId: teacher._id,
    status: 'pending'
  });
  return note;
};

export const listLessonNotesService = async ({ teacherId, status }) => {
  const teacher = await ensureTeacher(teacherId);
  const query = { teacherId: teacher._id };
  if (status) query.status = status;
  return LessonNote.find(query)
    .populate('classId', 'name')
    .populate('subjectId', 'name')
    .sort('-createdAt');
};

export const uploadMaterialService = async ({ teacherId, payload }) => {
  const { teacher } = await ensureClassAccess(teacherId, payload.classId);
  const material = await Material.create({
    ...payload,
    teacherId: teacher._id
  });
  return material;
};

export const listTeacherMaterialsService = async ({ teacherId, classId }) => {
  const teacher = await ensureTeacher(teacherId);
  const query = { teacherId: teacher._id };
  if (classId) query.classId = classId;
  return Material.find(query).sort('-createdAt');
};

export const getTeachingTimetableService = async ({ teacherId }) => {
  const teacher = await ensureTeacher(teacherId);
  const classes = await listTeacherClassesService(teacherId);
  const classIds = classes.map((cls) => cls._id);
  return Timetable.find({
    $or: [{ classId: { $in: classIds } }, { 'entries.teacherId': teacher._id }]
  }).sort('className');
};

export const getExamTimetableService = async ({ teacherId }) => {
  await ensureTeacher(teacherId);
  const classes = await listTeacherClassesService(teacherId);
  const classIds = classes.map((cls) => cls._id);
  return ExamTimetable.find({ classId: { $in: classIds } }).sort('-createdAt');
};

export const listScheduleUpdatesService = async ({ teacherId }) =>
  listTeacherAnnouncementsService(teacherId, { category: 'schedule' });

export const notifyClassService = async ({ teacherId, payload }) => {
  const { teacher } = await ensureClassAccess(teacherId, payload.classId);
  const announcement = await Announcement.create({
    title: payload.title,
    body: payload.body,
    classId: payload.classId,
    audience: 'class',
    role: 'student',
    category: payload.category || 'class-notice',
    publishedBy: teacher.userId._id,
    publishAt: new Date()
  });
  return announcement;
};

export const getTeacherDashboardService = async (teacherId) => {
  const [profile, classes, subjects, announcements] = await Promise.all([
    getTeacherProfileService(teacherId),
    listTeacherClassesService(teacherId),
    listTeacherSubjectsService(teacherId),
    listTeacherAnnouncementsService(teacherId, {})
  ]);
  return {
    profile,
    stats: {
      classCount: classes.length,
      subjectCount: subjects.length,
      announcements: announcements.length
    },
    classes,
    subjects,
    announcements: announcements.slice(0, 5)
  };
};
