import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Announcement from '../models/Announcement.js';
import Attendance from '../models/Attendance.js';

const populateChildProfile = [
  {
    path: 'userId',
    select: 'firstName lastName email phone avatarUrl'
  },
  {
    path: 'classId',
    select: 'name level session term homeroomTeacherId',
    populate: {
      path: 'homeroomTeacherId',
      select: 'userId',
      populate: { path: 'userId', select: 'firstName lastName email' }
    }
  }
];

export const getParentDashboardService = async (userId) => {
  const parent = await Parent.findOne({ userId }).populate({ path: 'children', populate: populateChildProfile });
  if (!parent) throw new Error('Parent profile not found');

  const studentIds = parent.children.map((child) => child._id);

  const pendingFees = await Fee.find({ studentId: { $in: studentIds }, status: { $ne: 'paid' } }).lean();
  const announcements = await Announcement.find({ audience: { $in: ['all', 'parent'] } })
    .sort('-createdAt')
    .limit(5)
    .lean();
  const attendance = await Attendance.find({ studentId: { $in: studentIds } }).lean();

  return {
    children: parent.children,
    pendingFees,
    announcements,
    attendanceSummary: attendance.length
  };
};

export const getChildrenService = async (userId) => {
  const parent = await Parent.findOne({ userId }).populate({ path: 'children', populate: populateChildProfile });
  return parent?.children ?? [];
};

export const getPaymentHistoryService = async (userId) => {
  console.log(userId);
  
  const parent = await Parent.findOne({ userId });
  const studentIds = parent?.children ?? [];
  const payments = await Fee.find({ studentId: { $in: studentIds } }).sort('-createdAt');
  return payments;
};

export const getParentAttendanceService = async (userId, filters = {}) => {
  const parent = await Parent.findOne({ userId }).populate({ path: 'children', populate: populateChildProfile });
  if (!parent) throw new Error('Parent profile not found');

  const linkedChildIds = parent.children.map((child) => child._id);
  if (!linkedChildIds.length) {
    return { children: parent.children, records: [] };
  }

  let targetChildIds = linkedChildIds;
  if (filters.childId) {
    const target = linkedChildIds.find((id) => id.equals(filters.childId.toString()));
    if (!target) {
      throw new Error('Child not linked to this parent');
    }
    targetChildIds = [target];
  }

  const records = await Attendance.find({ studentId: { $in: targetChildIds } })
    .sort('-date')
    .populate({
      path: 'studentId',
      populate: populateChildProfile
    })
    .lean();

  return {
    children: parent.children,
    records
  };
};

export const getParentFeesService = async (userId) => {
  const parent = await Parent.findOne({ userId });
  const childId = parent?.children.toString()
  // console.log(childId);
  
  if (!parent) throw new Error('Parent profile not found');

  if (!parent.children.length) return [];

  // console.log(Fee);
  

  const fees = await Fee.find({ studentId: { $in: childId } })
    .populate({
      path: 'studentId',
      populate: populateChildProfile
    })
    .sort('-createdAt')
    .lean();
console.log("done,");


  return fees.map((fee) => ({
    ...fee,
    student: fee.studentId
      ? {
          _id: fee.studentId._id,
          fullName: `${fee.studentId.userId?.firstName ?? ''} ${fee.studentId.userId?.lastName ?? ''}`.trim(),
          admissionNumber: fee.studentId.admissionNumber,
          className: fee.studentId.classId?.name
        }
      : null
  }));
};

export const linkChildToParentService = async (userId, payload) => {
  const parent = await Parent.findOne({ userId });
  if (!parent) throw new Error('Parent profile not found');

  const admissionNumber = payload.admissionNumber?.trim()?.toUpperCase();
  if (!admissionNumber) throw new Error('Admission number is required');

  const student = await Student.findOne({ admissionNumber }).populate(populateChildProfile);
  if (!student) throw new Error('Student not found');

  if (payload.dateOfBirth) {
    const parsedDate = new Date(payload.dateOfBirth);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date of birth supplied');
    }
    const provided = parsedDate.toISOString().split('T')[0];
    const stored = student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : null;
    if (!stored || stored !== provided) {
      throw new Error('Unable to verify student details');
    }
  }

  const alreadyLinked = parent.children.some((childId) => childId.equals(student._id));
  if (!alreadyLinked) {
    parent.children.push(student._id);
    await parent.save();
  }

  student.parentIds = student.parentIds ?? [];
  if (!student.parentIds.some((pid) => pid.equals(parent._id))) {
    student.parentIds.push(parent._id);
    await student.save();
  }

  return student;
};

export const getChildProfileService = async (userId, childId) => {
  const parent = await Parent.findOne({ userId }).select('children');
  if (!parent) throw new Error('Parent profile not found');

  const isLinked = parent.children.some((id) => id.equals(childId));
  if (!isLinked) throw new Error('Child not linked to this parent');

  const student = await Student.findById(childId).populate(populateChildProfile).lean();
  if (!student) throw new Error('Student not found');

  return student;
};
