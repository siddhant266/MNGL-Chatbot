import mongoose  from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
    enum: ['ORM', 'RRM', 'CRM', 'IT', 'PROJECT']
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  color: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  agents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    autoAssignment: {
      type: Boolean,
      default: true
    },
    maxComplaintsPerAgent: {
      type: Number,
      default: 20
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '18:00'
      }
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  metrics: {
    totalComplaints: {
      type: Number,
      default: 0
    },
    resolvedComplaints: {
      type: Number,
      default: 0
    },
    avgResolutionTime: {
      type: Number,
      default: 0
    },
    satisfactionScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Method to update department metrics
departmentSchema.methods.updateMetrics = async function() {
  const Complaint = mongoose.model('Complaint');
  
  const stats = await Complaint.aggregate([
    { $match: { department: this.departmentId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
          }
        },
        avgTime: {
          $avg: {
            $cond: [
              { $ne: ['$resolution.resolvedAt', null] },
              {
                $divide: [
                  { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24 // Convert to days
                ]
              },
              null
            ]
          }
        },
        avgRating: {
          $avg: '$resolution.satisfactionRating'
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.metrics.totalComplaints = stats[0].total;
    this.metrics.resolvedComplaints = stats[0].resolved;
    this.metrics.avgResolutionTime = stats[0].avgTime || 0;
    this.metrics.satisfactionScore = stats[0].avgRating || 0;
    await this.save();
  }
  
  return this.metrics;
};

// module.exports = mongoose.model('Department', departmentSchema);
const Department = mongoose.model("Department", departmentSchema);

export default Department; // ✅ THIS LINE FIXES IT