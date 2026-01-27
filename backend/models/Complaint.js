import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `CMP-${new mongoose.Types.ObjectId()
        .toHexString()
        .slice(-8)
        .toUpperCase()}`;
      
    }
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['ORM', 'RRM', 'CRM', 'IT', 'PROJECT'],
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Service Quality',
      'Technical Issues',
      'Billing',
      'Delivery',
      'Communication',
      'Other'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'resolved', 'escalated', 'closed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reportedBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionNote: String,
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  timeline: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  sla: {
    responseTime: Number, // in hours
    resolutionTime: Number, // in hours
    responseDeadline: Date,
    resolutionDeadline: Date,
    isBreached: {
      type: Boolean,
      default: false
    }
  },
  tags: [String],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
complaintSchema.index({ department: 1, status: 1 });

complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ priority: 1, status: 1 });

// Virtual for resolution time in days
complaintSchema.virtual('resolutionTimeInDays').get(function() {
  if (this.resolution.resolvedAt) {
    const diff = this.resolution.resolvedAt - this.createdAt;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Pre-save middleware to set SLA deadlines
complaintSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    
    // Set SLA based on priority
    const slaConfig = {
      critical: { response: 1, resolution: 4 },
      high: { response: 4, resolution: 24 },
      medium: { response: 8, resolution: 72 },
      low: { response: 24, resolution: 168 }
    };
    
    const sla = slaConfig[this.priority];
    
    this.sla.responseTime = sla.response;
    this.sla.resolutionTime = sla.resolution;
    this.sla.responseDeadline = new Date(now.getTime() + sla.response * 60 * 60 * 1000);
    this.sla.resolutionDeadline = new Date(now.getTime() + sla.resolution * 60 * 60 * 1000);
    
    // Add initial timeline entry
    this.timeline.push({
      action: 'created',
      timestamp: now,
      details: 'Complaint created'
    });
  }
  
  next();
});

// Method to check if SLA is breached
complaintSchema.methods.checkSLABreach = function() {
  const now = new Date();
  if (this.status !== 'resolved' && this.status !== 'closed') {
    if (now > this.sla.resolutionDeadline) {
      this.sla.isBreached = true;
      return true;
    }
  }
  return false;
};

// Static method to get statistics
complaintSchema.statics.getStatistics = async function(department = null, startDate = null, endDate = null) {
  const match = {};
  
  if (department) match.department = department;
  if (startDate && endDate) {
    match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        escalated: { $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
        avgResolutionTime: { $avg: '$sla.resolutionTime' }
      }
    }
  ]);
  
  return stats;
};

// module.exports = mongoose.model('Complaint', complaintSchema);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint; // ✅ IMPORTANT
