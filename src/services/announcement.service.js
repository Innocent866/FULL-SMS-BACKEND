import Announcement from '../models/Announcement.js';

// export const listAnnouncementsService = async (query, user) => {
//   const filters = {};
//   if (query.audience) filters.audience = query.audience;
//   if (query.classId) filters.classId = query.classId;
//   if (user?.role === 'parent') filters.audience = { $in: ['all', 'parent'] };
//   if (user?.role === 'teacher') filters.audience = { $in: ['all', 'teacher'] };
//   if (user?.role === 'student') filters.audience = { $in: ['all', 'student'] };
//   console.log(query.audience);
//   console.log(user.role);
  
//   return Announcement.find(filters).sort('-createdAt');
// };

export const listAnnouncementsService = async (query, user) => {
  let filters = {};

  // Special case: Admin sees all unless selecting specific audience
  if (user.role === 'admin') {
    if (query.audience && query.audience !== 'all') {
      filters.audience = query.audience;
    }
    if (query.classId) filters.classId = query.classId;
    if (query.category && query.category !== 'all') filters.category = query.category;
    return Announcement.find(filters).sort('-createdAt');
  }

  // Role-based allowed audiences
  const allowedAudiences = {
    parent: ['all', 'parent'],
    teacher: ['all', 'teacher'],
    student: ['all', 'student']
  }[user.role] || ['all'];

  console.log(allowedAudiences);
  
  // Apply audience filter
  if (query.audience && query.audience !== 'all') {
    // User selected a specific audience → intersect with allowed ones
    filters.audience = query.audience;
  } else {
    // "all" selected → show allowed audiences
    filters.audience = { $in: allowedAudiences };
  }

  // Optional class filter
  if (query.classId) {
    filters.classId = query.classId;
  }

  if (query.category && query.category !== 'all') {
    filters.category = query.category;
  }

  console.log(filters.audience);
  
  return Announcement.find(filters).sort('-createdAt');
};



export const createAnnouncementService = async (payload) => {
  return Announcement.create(payload);
};
