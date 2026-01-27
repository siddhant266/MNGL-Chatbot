import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Total counts
  const totalComplaints = await Complaint.countDocuments(dateFilter);
  const resolvedComplaints = await Complaint.countDocuments({ ...dateFilter, status: 'resolved' });
  const pendingComplaints = await Complaint.countDocuments({ ...dateFilter, status: 'pending' });
  const escalatedComplaints = await Complaint.countDocuments({ ...dateFilter, status: 'escalated' });
  
  // Resolution rate
  const resolutionRate = totalComplaints > 0 
    ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2)
    : 0;

  // Average resolution time
  const avgResolutionTime = await Complaint.aggregate([
    { 
      $match: { 
        ...dateFilter, 
        status: 'resolved',
        'resolution.resolvedAt': { $exists: true }
      } 
    },
    {
      $project: {
        resolutionTime: {
          $divide: [
            { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
            1000 * 60 * 60 * 24 // Convert to days
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgTime: { $avg: '$resolutionTime' }
      }
    }
  ]);

  // Department-wise breakdown
  const departmentStats = await Complaint.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        escalated: {
          $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        escalatedComplaints,
        resolutionRate: parseFloat(resolutionRate),
        avgResolutionTime: avgResolutionTime[0]?.avgTime?.toFixed(2) || 0
      },
      departmentStats
    }
  });
});

// @desc    Get department analytics
// @route   GET /api/analytics/departments
// @access  Private
export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const departments = ['ORM', 'RRM', 'CRM', 'IT', 'PROJECT'];
  
  const analytics = await Promise.all(
    departments.map(async (dept) => {
      const stats = await Complaint.aggregate([
        { $match: { department: dept } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            escalated: { $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] } },
            critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
            high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
            avgResolutionTime: {
              $avg: {
                $cond: [
                  { $ne: ['$resolution.resolvedAt', null] },
                  {
                    $divide: [
                      { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                      1000 * 60 * 60 * 24
                    ]
                  },
                  null
                ]
              }
            }
          }
        }
      ]);

      return {
        department: dept,
        ...stats[0]
      };
    })
  );

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// @desc    Get trend analysis
// @route   GET /api/analytics/trends
// @access  Private
export const getTrendAnalysis = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

  const trends = await Complaint.aggregate([
    {
      $match: {
        createdAt: { $gte: monthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          department: '$department'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Transform data for frontend
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedTrends = {};

  trends.forEach(item => {
    const monthKey = monthNames[item._id.month - 1];
    if (!formattedTrends[monthKey]) {
      formattedTrends[monthKey] = { month: monthKey };
    }
    formattedTrends[monthKey][item._id.department] = item.count;
  });

  res.status(200).json({
    success: true,
    data: Object.values(formattedTrends)
  });
});

// @desc    Get category distribution
// @route   GET /api/analytics/categories
// @access  Private
export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const distribution = await Complaint.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        name: '$_id',
        value: '$count',
        _id: 0
      }
    },
    {
      $sort: { value: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: distribution
  });
});

// @desc    Get priority distribution
// @route   GET /api/analytics/priorities
// @access  Private
export const getPriorityDistribution = asyncHandler(async (req, res) => {
  const distribution = await Complaint.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        priority: '$_id',
        count: '$count',
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: distribution
  });
});

// @desc    Get resolution time analysis
// @route   GET /api/analytics/resolution-time
// @access  Private
export const getResolutionTimeAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Complaint.aggregate([
    {
      $match: {
        status: 'resolved',
        'resolution.resolvedAt': { $exists: true }
      }
    },
    {
      $project: {
        department: 1,
        resolutionTime: {
          $divide: [
            { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    {
      $group: {
        _id: '$department',
        avgTime: { $avg: '$resolutionTime' },
        minTime: { $min: '$resolutionTime' },
        maxTime: { $max: '$resolutionTime' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: analysis
  });
});

// @desc    Get SLA compliance
// @route   GET /api/analytics/sla-compliance
// @access  Private
export const getSLACompliance = asyncHandler(async (req, res) => {
  const compliance = await Complaint.aggregate([
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        breached: { $sum: { $cond: ['$sla.isBreached', 1, 0] } },
        compliant: { $sum: { $cond: ['$sla.isBreached', 0, 1] } }
      }
    },
    {
      $project: {
        department: '$_id',
        total: 1,
        breached: 1,
        compliant: 1,
        complianceRate: {
          $multiply: [
            { $divide: ['$compliant', '$total'] },
            100
          ]
        },
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: compliance
  });
});

// @desc    Get agent performance
// @route   GET /api/analytics/agent-performance
// @access  Private (Manager/Admin)
export const getAgentPerformance = asyncHandler(async (req, res) => {
  const { department } = req.query;
  
  const matchQuery = { assignedTo: { $ne: null } };
  if (department) {
    matchQuery.department = department;
  }

  const performance = await Complaint.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$assignedTo',
        totalAssigned: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        avgRating: { $avg: '$resolution.satisfactionRating' },
        avgResolutionTime: {
          $avg: {
            $cond: [
              { $ne: ['$resolution.resolvedAt', null] },
              {
                $divide: [
                  { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24
                ]
              },
              null
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'agentInfo'
      }
    },
    {
      $unwind: '$agentInfo'
    },
    {
      $project: {
        agentName: '$agentInfo.name',
        agentEmail: '$agentInfo.email',
        department: '$agentInfo.department',
        totalAssigned: 1,
        resolved: 1,
        pending: 1,
        avgRating: { $round: ['$avgRating', 2] },
        avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
        resolutionRate: {
          $multiply: [
            { $divide: ['$resolved', '$totalAssigned'] },
            100
          ]
        }
      }
    },
    {
      $sort: { resolutionRate: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: performance
  });
});

// @desc    Export report
// @route   GET /api/analytics/export
// @access  Private (Admin/Manager)
export const exportReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, department, format = 'json' } = req.query;
  
  const query = {};
  if (department) query.department = department;
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const complaints = await Complaint.find(query)
    .populate('assignedTo', 'name email')
    .populate('reportedBy.userId', 'name email')
    .sort('-createdAt')
    .lean();

  // For CSV export, you would format the data differently
  if (format === 'csv') {
    // Implement CSV conversion logic here
    const csvData = complaints.map(c => ({
      ID: c.complaintId,
      Title: c.title,
      Department: c.department,
      Status: c.status,
      Priority: c.priority,
      CreatedAt: c.createdAt,
      ResolvedAt: c.resolution?.resolvedAt || 'N/A'
    }));
    
    res.status(200).json({
      success: true,
      format: 'csv',
      data: csvData
    });
  } else {
    res.status(200).json({
      success: true,
      format: 'json',
      data: complaints
    });
  }
});

// @desc    Get custom range analytics
// @route   POST /api/analytics/custom-range
// @access  Private
export const getCustomRangeAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, departments, metrics } = req.body;
  
  const query = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  if (departments && departments.length > 0) {
    query.department = { $in: departments };
  }

  const results = {};
  
  // Calculate requested metrics
  if (metrics.includes('total')) {
    results.total = await Complaint.countDocuments(query);
  }
  
  if (metrics.includes('byStatus')) {
    results.byStatus = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
  }
  
  if (metrics.includes('byPriority')) {
    results.byPriority = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
  }
  
  if (metrics.includes('byDepartment')) {
    results.byDepartment = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
  }

  res.status(200).json({
    success: true,
    data: results
  });
});

// @desc    Get realtime metrics
// @route   GET /api/analytics/realtime
// @access  Private
export const getRealtimeMetrics = asyncHandler(async (req, res) => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  const metrics = {
    last24Hours: await Complaint.countDocuments({ createdAt: { $gte: last24Hours } }),
    lastHour: await Complaint.countDocuments({ createdAt: { $gte: lastHour } }),
    currentlyPending: await Complaint.countDocuments({ status: 'pending' }),
    currentlyEscalated: await Complaint.countDocuments({ status: 'escalated' }),
    criticalOpen: await Complaint.countDocuments({ 
      priority: 'critical', 
      status: { $nin: ['resolved', 'closed'] } 
    })
  };

  res.status(200).json({
    success: true,
    timestamp: now,
    data: metrics
  });
});
