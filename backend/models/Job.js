const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    employmentType: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive']
    },
    salary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    requirements: [{
      type: String
    }],
    responsibilities: [{
      type: String
    }],
    benefits: [{
      type: String
    }],
    skills: [{
      type: String
    }],
    applicationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active'
    },
    applicationEmail: {
      type: String,
      trim: true
    },
    applicationUrl: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
jobSchema.index({ status: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
