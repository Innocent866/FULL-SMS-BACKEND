import User from '../models/User.js';
import Student from '../models/Student.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Timetable from '../models/Timetable.js';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import ClassLevel from '../models/ClassLevel.js';
import ClassArm from '../models/ClassArm.js';
import SchoolSession from '../models/SchoolSession.js';
import SchoolTerm from '../models/SchoolTerm.js';
import GradingProfile from '../models/GradingProfile.js';
import { ROLES } from '../utils/roles.js';
import { hashPassword } from '../utils/password.js';

const formatFullName = (user) => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

const normalizeSpecialization = (specialization) => {
  if (!specialization) return [];
  if (Array.isArray(specialization)) return specialization;
  return specialization
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveAcademicLabels = async ({ levelId, armId, sessionId, termId }) => {
  const [level, arm, session, term] = await Promise.all([
    levelId ? ClassLevel.findById(levelId) : null,
    armId ? ClassArm.findById(armId) : null,
    sessionId ? SchoolSession.findById(sessionId) : null,
    termId ? SchoolTerm.findById(termId) : null
  ]);
  return {
    levelName: level?.name,
    armName: arm?.name,
    sessionName: session?.name,
    termName: term?.name
  };
};

const ensureStudent = async (studentId) => {
  const student = await Student.findById(studentId).populate('userId');
  if (!student) {
    const error = new Error('Student not found');
    error.status = 404;
    throw error;
  }
  return student;
};

const ensureTeacher = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId).populate('userId');
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.status = 404;
    throw error;
  }
  return teacher;
};

const ensureClass = async (classId) => {
  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    const error = new Error('Class not found');
    error.status = 404;
    throw error;
  }
  return classDoc;
};

const ensureSubject = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    const error = new Error('Subject not found');
    error.status = 404;
    throw error;
  }
  return subject;
};

const ensureSession = async (sessionId) => {
  if (!sessionId) return null;
  const session = await SchoolSession.findById(sessionId);
  if (!session) {
    const error = new Error('School session not found');
    error.status = 404;
    throw error;
  }
  return session;
};

/* -------------------------------------------------------------------------- */
/*                              STUDENT SERVICES                              */
/* -------------------------------------------------------------------------- */

export const listStudentsService = async () => {
  const students = await Student.find()
    .populate('userId', 'firstName lastName email phone status')
    .populate({
      path: 'classId',
      populate: [
        { path: 'levelId', select: 'name' },
        { path: 'armId', select: 'name' },
        { path: 'sessionId', select: 'name' }
      ]
    })
    .sort('-createdAt');

  return students.map((student) => ({
    id: student._id,
    userId: student.userId?._id,
    firstName: student.userId?.firstName,
    lastName: student.userId?.lastName,
    name: formatFullName(student.userId),
    email: student.userId?.email,
    phone: student.userId?.phone,
    status: student.userId?.status ?? 'active',
    admissionNumber: student.admissionNumber,
    classId: student.classId?._id,
    className: student.classId?.name,
    classLevel: student.classId?.levelId?.name || student.sessionHistory?.[0]?.classLevel || 'Not set',
    arm: student.classId?.armId?.name || student.classId?.arm,
    session: student.classId?.sessionId?.name || student.classId?.session,
    createdAt: student.createdAt,
    address: student.address
  }));
};

export const createStudentService = async (payload) => {
  const passwordHash = await hashPassword(payload.password || 'Student123!');
  const user = await User.create({
    role: ROLES.STUDENT,
    email: payload.email.toLowerCase(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    passwordHash
  });

  let classDoc = null;
  if (payload.classId) {
    classDoc = await Class.findById(payload.classId).populate(['levelId', 'sessionId']);
  }
  const sessionHistoryEntry =
    payload.classLevel || classDoc
      ? {
          session: payload.session || classDoc?.sessionId?.name || payload.sessionName || '2025/2026',
          classLevel: classDoc?.levelId?.name || payload.classLevel
        }
      : null;

  const student = await Student.create({
    userId: user._id,
    classId: classDoc?._id,
    parentIds: payload.parentIds?.length ? payload.parentIds : [],
    admissionNumber: payload.admissionNumber,
    sessionHistory: sessionHistoryEntry ? [sessionHistoryEntry] : [],
    address: payload.address
  });

  if (payload.parentIds?.length) {
    await Parent.updateMany({ _id: { $in: payload.parentIds } }, { $addToSet: { children: student._id } });
  }

  return { userId: user._id, studentId: student._id };
};

export const updateStudentService = async (studentId, payload) => {
  const student = await ensureStudent(studentId);
  if (payload.email || payload.firstName || payload.lastName || payload.phone) {
    await User.findByIdAndUpdate(
      student.userId._id,
      {
        $set: {
          email: payload.email?.toLowerCase() ?? student.userId.email,
          firstName: payload.firstName ?? student.userId.firstName,
          lastName: payload.lastName ?? student.userId.lastName,
          phone: payload.phone ?? student.userId.phone
        }
      },
      { new: true }
    );
  }

  let classDoc = null;
  if (payload.classId) {
    classDoc = await Class.findById(payload.classId).populate(['levelId', 'sessionId']);
  }

  const updateBody = {
    admissionNumber: payload.admissionNumber ?? student.admissionNumber,
    classId: payload.classId ?? student.classId,
    address: payload.address ?? student.address
  };

  if (payload.parentIds) {
    updateBody.parentIds = payload.parentIds;
    await Parent.updateMany({ children: student._id }, { $pull: { children: student._id } });
    if (payload.parentIds.length) {
      await Parent.updateMany({ _id: { $in: payload.parentIds } }, { $addToSet: { children: student._id } });
    }
  }

  if (payload.session || payload.classLevel || classDoc) {
    updateBody.$push = {
      sessionHistory: {
        session: payload.session || classDoc?.sessionId?.name || '2025/2026',
        classLevel: payload.classLevel || classDoc?.levelId?.name || student.sessionHistory?.slice(-1)[0]?.classLevel
      }
    };
  }

  await Student.findByIdAndUpdate(studentId, updateBody, { new: true });
  return { studentId };
};

export const changeStudentStatusService = async (studentId, status) => {
  if (!['active', 'suspended'].includes(status)) {
    const error = new Error('Invalid status value');
    error.status = 400;
    throw error;
  }
  const student = await ensureStudent(studentId);
  await User.findByIdAndUpdate(student.userId._id, { status }, { new: true });
  return { studentId, status };
};

export const deleteStudentService = async (studentId) => {
  const student = await ensureStudent(studentId);
  await Parent.updateMany({ children: student._id }, { $pull: { children: student._id } });
  await Student.deleteOne({ _id: studentId });
  await User.deleteOne({ _id: student.userId._id });
  return { studentId };
};

/* -------------------------------------------------------------------------- */
/*                              TEACHER SERVICES                              */
/* -------------------------------------------------------------------------- */

export const listTeachersService = async () => {
  const teachers = await Teacher.find()
    .populate('userId', 'firstName lastName email phone status')
    .sort('-createdAt');
  return teachers.map((teacher) => ({
    id: teacher._id,
    userId: teacher.userId?._id,
    firstName: teacher.userId?.firstName,
    lastName: teacher.userId?.lastName,
    name: formatFullName(teacher.userId),
    email: teacher.userId?.email,
    phone: teacher.userId?.phone || '—',
    status: teacher.userId?.status ?? 'active',
    specialization: teacher.specialization?.join(', ') || '—',
    specializationList: teacher.specialization || [],
    staffNo: teacher.staffNo,
    qualifications: teacher.qualifications
  }));
};

export const createTeacherService = async (payload) => {
  const passwordHash = await hashPassword(payload.password || 'Teacher123!');
  const user = await User.create({
    role: ROLES.TEACHER,
    email: payload.email.toLowerCase(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    passwordHash
  });

  const teacher = await Teacher.create({
    userId: user._id,
    staffNo: payload.staffNo,
    specialization: normalizeSpecialization(payload.specialization),
    qualifications: payload.qualifications,
    employmentDate: payload.employmentDate
  });

  return { userId: user._id, teacherId: teacher._id };
};

export const updateTeacherService = async (teacherId, payload) => {
  const teacher = await ensureTeacher(teacherId);

  if (payload.email || payload.firstName || payload.lastName || payload.phone) {
    await User.findByIdAndUpdate(
      teacher.userId._id,
      {
        $set: {
          email: payload.email?.toLowerCase() ?? teacher.userId.email,
          firstName: payload.firstName ?? teacher.userId.firstName,
          lastName: payload.lastName ?? teacher.userId.lastName,
          phone: payload.phone ?? teacher.userId.phone
        }
      },
      { new: true }
    );
  }

  await Teacher.findByIdAndUpdate(
    teacherId,
    {
      staffNo: payload.staffNo ?? teacher.staffNo,
      specialization: normalizeSpecialization(payload.specialization) ?? teacher.specialization,
      qualifications: payload.qualifications ?? teacher.qualifications,
      employmentDate: payload.employmentDate ?? teacher.employmentDate
    },
    { new: true }
  );

  return { teacherId };
};

export const changeTeacherStatusService = async (teacherId, status) => {
  if (!['active', 'suspended'].includes(status)) {
    const error = new Error('Invalid status value');
    error.status = 400;
    throw error;
  }
  const teacher = await ensureTeacher(teacherId);
  await User.findByIdAndUpdate(teacher.userId._id, { status }, { new: true });
  return { teacherId, status };
};

export const deleteTeacherService = async (teacherId) => {
  const teacher = await ensureTeacher(teacherId);
  await Class.updateMany({ homeroomTeacherId: teacher._id }, { $unset: { homeroomTeacherId: 1 } });
  await Subject.updateMany({ teacherIds: teacher._id }, { $pull: { teacherIds: teacher._id } });
  await Teacher.deleteOne({ _id: teacherId });
  await User.deleteOne({ _id: teacher.userId._id });
  return { teacherId };
};

/* -------------------------------------------------------------------------- */
/*                            GENERAL ACCOUNT ADMIN                           */
/* -------------------------------------------------------------------------- */

export const listAccountsService = async () => {
  const users = await User.find({ role: ROLES.ADMIN }).sort('-createdAt');
  return users.map((user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: formatFullName(user),
    email: user.email,
    phone: user.phone,
    status: user.status
  }));
};

export const createAccountService = async (payload) => {
  const passwordHash = await hashPassword(payload.password || 'Admin123!');
  const user = await User.create({
    role: payload.role || ROLES.ADMIN,
    email: payload.email.toLowerCase(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    passwordHash,
    status: payload.status || 'active'
  });
  return { userId: user._id };
};

export const updateAccountService = async (accountId, payload) => {
  const update = {};
  ['firstName', 'lastName', 'phone', 'status'].forEach((field) => {
    if (payload[field]) update[field] = payload[field];
  });
  if (payload.email) update.email = payload.email.toLowerCase();
  if (payload.password) {
    update.passwordHash = await hashPassword(payload.password);
  }
  const updated = await User.findByIdAndUpdate(accountId, { $set: update }, { new: true });
  if (!updated) {
    const error = new Error('Account not found');
    error.status = 404;
    throw error;
  }
  return { accountId: updated._id };
};

export const changeAccountStatusService = async (accountId, status) => {
  const updated = await User.findByIdAndUpdate(accountId, { status }, { new: true });
  if (!updated) {
    const error = new Error('Account not found');
    error.status = 404;
    throw error;
  }
  return { accountId, status };
};

export const deleteAccountService = async (accountId) => {
  await User.deleteOne({ _id: accountId });
  return { accountId };
};

/* -------------------------------------------------------------------------- */
/*                              CLASS MANAGEMENT                              */
/* -------------------------------------------------------------------------- */

export const listClassesService = async () =>
  Class.find()
    .populate('levelId', 'name order')
    .populate('armId', 'name')
    .populate('sessionId', 'name status')
    .populate('termId', 'name status')
    .populate({
      path: 'homeroomTeacherId',
      populate: { path: 'userId', select: 'firstName lastName email' }
    })
    .sort('level');

export const createClassService = async (payload) => {
  const labels = await resolveAcademicLabels(payload);
  const classDoc = await Class.create({
    name: payload.name,
    code: payload.code,
    levelId: payload.levelId,
    level: labels.levelName,
    armId: payload.armId,
    arm: labels.armName,
    sessionId: payload.sessionId,
    session: labels.sessionName,
    termId: payload.termId,
    term: labels.termName,
    capacity: payload.capacity,
    homeroomTeacherId: payload.homeroomTeacherId || undefined
  });
  if (payload.homeroomTeacherId) {
    await Teacher.findByIdAndUpdate(payload.homeroomTeacherId, { $addToSet: { classIds: classDoc._id } });
  }
  return classDoc;
};

export const updateClassService = async (classId, payload) => {
  await ensureClass(classId);
  const labels = await resolveAcademicLabels(payload);
  const updated = await Class.findByIdAndUpdate(
    classId,
    {
      $set: {
        name: payload.name,
        code: payload.code,
        levelId: payload.levelId,
        level: labels.levelName,
        armId: payload.armId,
        arm: labels.armName,
        sessionId: payload.sessionId,
        session: labels.sessionName,
        termId: payload.termId,
        term: labels.termName,
        capacity: payload.capacity
      }
    },
    { new: true }
  );
  return updated;
};

export const deleteClassService = async (classId) => {
  await ensureClass(classId);
  const studentCount = await Student.countDocuments({ classId });
  if (studentCount > 0) {
    const error = new Error('Cannot delete class with enrolled students');
    error.status = 400;
    throw error;
  }
  await Class.deleteOne({ _id: classId });
  return { classId };
};

export const assignClassTeacherService = async (classId, teacherId) => {
  const [classDoc, teacher] = await Promise.all([ensureClass(classId), ensureTeacher(teacherId)]);
  if (classDoc.homeroomTeacherId?.toString() !== teacherId.toString()) {
    if (classDoc.homeroomTeacherId) {
      await Teacher.findByIdAndUpdate(classDoc.homeroomTeacherId, { $pull: { classIds: classId } });
    }
  }
  classDoc.homeroomTeacherId = teacher._id;
  await classDoc.save();
  await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { classIds: classId } });
  return classDoc;
};

/* -------------------------------------------------------------------------- */
/*                        LEVEL / ARM / SESSION / TERM                        */
/* -------------------------------------------------------------------------- */

export const listClassLevelsService = async () => ClassLevel.find().sort('order');

export const createClassLevelService = (payload) => ClassLevel.create(payload);

export const updateClassLevelService = async (levelId, payload) =>
  ClassLevel.findByIdAndUpdate(levelId, payload, { new: true });

export const deleteClassLevelService = async (levelId) => {
  const classExists = await Class.exists({ levelId });
  if (classExists) {
    const error = new Error('Cannot delete level with attached classes');
    error.status = 400;
    throw error;
  }
  await ClassLevel.deleteOne({ _id: levelId });
  return { levelId };
};

export const listClassArmsService = async () =>
  ClassArm.find().populate('levelId', 'name').sort('name');

export const createClassArmService = (payload) => ClassArm.create(payload);

export const updateClassArmService = (armId, payload) => ClassArm.findByIdAndUpdate(armId, payload, { new: true });

export const deleteClassArmService = async (armId) => {
  const classExists = await Class.exists({ armId });
  if (classExists) {
    const error = new Error('Cannot delete arm with attached classes');
    error.status = 400;
    throw error;
  }
  await ClassArm.deleteOne({ _id: armId });
  return { armId };
};

export const listSchoolSessionsService = async () => SchoolSession.find().sort('-createdAt');

export const createSchoolSessionService = (payload) => SchoolSession.create(payload);

export const updateSchoolSessionService = (sessionId, payload) =>
  SchoolSession.findByIdAndUpdate(sessionId, payload, { new: true });

export const deleteSchoolSessionService = async (sessionId) => {
  const termExists = await SchoolTerm.exists({ sessionId });
  if (termExists) {
    const error = new Error('Cannot delete session with attached terms');
    error.status = 400;
    throw error;
  }
  await SchoolSession.deleteOne({ _id: sessionId });
  return { sessionId };
};

export const listSchoolTermsService = async (filters = {}) => {
  const query = {};
  if (filters.sessionId) query.sessionId = filters.sessionId;
  return SchoolTerm.find(query).populate('sessionId', 'name status').sort('-createdAt');
};

export const createSchoolTermService = (payload) => SchoolTerm.create(payload);

export const updateSchoolTermService = (termId, payload) =>
  SchoolTerm.findByIdAndUpdate(termId, payload, { new: true });

export const deleteSchoolTermService = async (termId) => {
  const classExists = await Class.exists({ termId });
  if (classExists) {
    const error = new Error('Cannot delete term with attached classes');
    error.status = 400;
    throw error;
  }
  await SchoolTerm.deleteOne({ _id: termId });
  return { termId };
};

/* -------------------------------------------------------------------------- */
/*                              SUBJECT MANAGEMENT                            */
/* -------------------------------------------------------------------------- */

export const listSubjectsService = async () =>
  Subject.find()
    .populate({
      path: 'teacherIds',
      populate: { path: 'userId', select: 'firstName lastName email' }
    })
    .sort('name');

export const createSubjectService = (payload) =>
  Subject.create({
    code: payload.code,
    name: payload.name,
    classLevel: payload.classLevel,
    description: payload.description,
    creditUnits: payload.creditUnits,
    teacherIds: payload.teacherIds || []
  });

export const updateSubjectService = async (subjectId, payload) =>
  Subject.findByIdAndUpdate(
    subjectId,
    {
      $set: {
        code: payload.code,
        name: payload.name,
        classLevel: payload.classLevel,
        description: payload.description,
        creditUnits: payload.creditUnits
      }
    },
    { new: true }
  );

export const deleteSubjectService = async (subjectId) => {
  await Subject.deleteOne({ _id: subjectId });
  return { subjectId };
};

export const assignSubjectTeachersService = async (subjectId, teacherIds = []) => {
  await ensureSubject(subjectId);
  return Subject.findByIdAndUpdate(subjectId, { teacherIds }, { new: true });
};

/* -------------------------------------------------------------------------- */
/*                        PERFORMANCE & ASSESSMENTS                           */
/* -------------------------------------------------------------------------- */

export const getGradingProfileService = async () => {
  let profile = await GradingProfile.findOne({ isDefault: true });
  if (!profile) {
    profile = await GradingProfile.create({
      name: 'Default Scheme',
      isDefault: true,
      grades: [
        { label: 'A', minScore: 70, maxScore: 100, remark: 'Excellent' },
        { label: 'B', minScore: 60, maxScore: 69, remark: 'Very Good' },
        { label: 'C', minScore: 50, maxScore: 59, remark: 'Good' },
        { label: 'D', minScore: 45, maxScore: 49, remark: 'Fair' },
        { label: 'E', minScore: 40, maxScore: 44, remark: 'Pass' },
        { label: 'F', minScore: 0, maxScore: 39, remark: 'Fail' }
      ]
    });
  }
  return profile;
};

export const upsertGradingProfileService = async (payload) => {
  const weights = payload.weights;
  if (!weights || (weights.CA1 ?? 0) + (weights.CA2 ?? 0) + (weights.project ?? 0) + (weights.exam ?? 0) !== 100) {
    const error = new Error('Assessment weights must total 100%');
    error.status = 400;
    throw error;
  }
  const update = {
    $set: {
      weights: payload.weights,
      grades: payload.grades
    },
    $setOnInsert: {
      name: payload.name || 'Default Scheme',
      isDefault: true
    }
  };
  const profile = await GradingProfile.findOneAndUpdate({ isDefault: true }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });
  return profile;
};

/* -------------------------------------------------------------------------- */
/*                           STUDENT PROMOTION FLOW                           */
/* -------------------------------------------------------------------------- */

export const promoteStudentsService = async ({ targetSessionId, targetTermId, dryRun = false }) => {
  const [sessionDoc, termDoc, levels, classes] = await Promise.all([
    ensureSession(targetSessionId),
    targetTermId ? SchoolTerm.findById(targetTermId) : null,
    ClassLevel.find().sort('order'),
    Class.find().populate(['levelId', 'armId', 'sessionId'])
  ]);

  const levelOrder = new Map();
  levels.forEach((level, index) => {
    levelOrder.set(level._id.toString(), levels[index + 1] || null);
  });

  const students = await Student.find().populate({
    path: 'classId',
    populate: [
      { path: 'levelId', select: 'name' },
      { path: 'armId', select: 'name' }
    ]
  });

  const summary = { promoted: 0, skipped: 0, details: [] };

  for (const student of students) {
    const currentClass = student.classId;
    if (!currentClass?.levelId) {
      summary.skipped += 1;
      summary.details.push({ studentId: student._id, reason: 'No class level information' });
      continue;
    }

    const nextLevel = levelOrder.get(currentClass.levelId._id.toString());
    if (!nextLevel) {
      summary.skipped += 1;
      summary.details.push({ studentId: student._id, reason: 'Already at terminal class' });
      continue;
    }

    const preferredArmId = currentClass.armId?._id?.toString();
    const nextClass =
      classes.find(
        (cls) =>
          cls.levelId?._id?.toString() === nextLevel._id.toString() &&
          (!!preferredArmId ? cls.armId?._id?.toString() === preferredArmId : true)
      ) || classes.find((cls) => cls.levelId?._id?.toString() === nextLevel._id.toString());

    if (!nextClass) {
      summary.skipped += 1;
      summary.details.push({ studentId: student._id, reason: 'No destination class configured' });
      continue;
    }

    if (!dryRun) {
      await Student.findByIdAndUpdate(student._id, {
        classId: nextClass._id,
        $push: {
          sessionHistory: {
            session: sessionDoc?.name || nextClass.sessionId?.name || currentClass.session || 'Next Session',
            classLevel: nextLevel.name
          }
        }
      });
    }
    summary.promoted += 1;
    summary.details.push({
      studentId: student._id,
      fromClassId: currentClass._id,
      toClassId: nextClass._id
    });
  }

  summary.total = students.length;
  summary.dryRun = dryRun;
  summary.session = sessionDoc?.name;
  summary.term = termDoc?.name;
  return summary;
};

/* -------------------------------------------------------------------------- */
/*                          PAYMENTS & COMMUNICATIONS                          */
/* -------------------------------------------------------------------------- */

export const listPaymentsService = async (filters) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) query.createdAt.$gte = new Date(filters.from);
    if (filters.to) query.createdAt.$lte = new Date(filters.to);
  }
  return Payment.find(query).sort('-createdAt');
};

export const createAnnouncementService = async (payload, authorId) => {
  const announcement = await Announcement.create({
    title: payload.title,
    body: payload.body,
    audience: payload.audience || 'all',
    role: payload.role,
    category: payload.category || 'general',
    classId: payload.classId,
    publishedBy: authorId,
    publishAt: payload.publishAt ? new Date(payload.publishAt) : new Date(),
    expiryAt: payload.expiryAt ? new Date(payload.expiryAt) : undefined
  });
  return announcement;
};

export const listAnnouncementsService = async () => Announcement.find().sort('-createdAt');

export const manageAnnouncementsService = async (id, updates) => Announcement.findByIdAndUpdate(id, updates, { new: true });

export const createTimetableService = async (payload) => {
  const timetable = await Timetable.create({
    className: payload.className,
    term: payload.term,
    notes: payload.notes,
    entries: payload.entries || []
  });
  return timetable;
};

export const listTimetablesService = async () => Timetable.find().sort('-createdAt');
