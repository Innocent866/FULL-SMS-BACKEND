import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    submittedAt: Date,
    attachments: [{ url: String, name: String }],
    grade: Number,
    feedback: String
  },
  { timestamps: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    dueDate: Date,
    resources: [{ url: String, name: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    status: { type: String, default: 'open' },
    submissions: [submissionSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
