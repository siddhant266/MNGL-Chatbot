import Complaint from "../models/Complaint.js";
import User from "../models/user.js";
import Department from "../models/Department.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create new complaint
// @route   POST /api/complaints/create
// @access  Public
export const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, department, category, reportedBy } = req.body;

  // Auto-detect priority based on keywords
  let priority = 'medium';
  const urgentKeywords = ['urgent', 'critical', 'emergency', 'immediate'];
  const highKeywords = ['important', 'asap', 'quickly'];
  
  const combinedText = `${title} ${description}`.toLowerCase();
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    priority = 'critical';
  } else if (highKeywords.some(keyword => combinedText.includes(keyword))) {
    priority = 'high';
  }

  const complaint = await Complaint.create({
    title,
    description,
    department,
    category,
    priority,
    reportedBy
  });

  res.status(201).json({
    success: true,
    message: 'Complaint created successfully',
    data: complaint
  });
});

// @desc    Get all complaints with filters
// @route   GET /api/complaints
// @access  Private
export const getAllComplaints = asyncHandler(async (req, res) => {
  const {
    department,
    status,
    priority,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = {};
  
  if (department) query.department = department;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // If user is agent/manager, filter by department
  if (req.user.role === 'agent' || req.user.role === 'manager') {
    query.department = req.user.department;
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const complaints = await Complaint.find(query)
    .populate('assignedTo', 'name email')
    .populate('reportedBy.userId', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Complaint.countDocuments(query);

  res.status(200).json({
    success: true,
    count: complaints.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: complaints
  });
});

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('assignedTo', 'name email phone')
    .populate('comments.user', 'name email')
    .populate('resolution.resolvedBy', 'name email');

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  res.status(200).json({
    success: true,
    data: complaint
  });
});

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = asyncHandler(async (req, res) => {
  let complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Add to timeline
  complaint.timeline.push({
    action: 'updated',
    performedBy: req.user.id,
    timestamp: new Date(),
    details: 'Complaint details updated'
  });

  complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Complaint updated successfully',
    data: complaint
  });
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin/Manager)
export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  await complaint.remove();

  res.status(200).json({
    success: true,
    message: 'Complaint deleted successfully'
  });
});

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.status = status;
  complaint.timeline.push({
    action: 'status_changed',
    performedBy: req.user.id,
    timestamp: new Date(),
    details: `Status changed to ${status}`
  });

  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Status updated successfully',
    data: complaint
  });
});

// @desc    Assign complaint to agent
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Manager/Admin)
export const assignComplaint = asyncHandler(async (req, res) => {
  const { agentId } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  const agent = await User.findById(agentId);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: 'Agent not found'
    });
  }

  complaint.assignedTo = agentId;
  complaint.status = 'in-progress';
  complaint.timeline.push({
    action: 'assigned',
    performedBy: req.user.id,
    timestamp: new Date(),
    details: `Assigned to ${agent.name}`
  });

  await complaint.save();

  // Add to agent's assigned complaints
  agent.assignedComplaints.push(complaint._id);
  await agent.save();

  res.status(200).json({
    success: true,
    message: 'Complaint assigned successfully',
    data: complaint
  });
});

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.comments.push({
    user: req.user.id,
    comment,
    createdAt: new Date()
  });

  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: complaint
  });
});

// @desc    Resolve complaint
// @route   PATCH /api/complaints/:id/resolve
// @access  Private
export const resolveComplaint = asyncHandler(async (req, res) => {
  const { resolutionNote } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.status = 'resolved';
  complaint.resolution = {
    resolvedBy: req.user.id,
    resolvedAt: new Date(),
    resolutionNote
  };
  complaint.timeline.push({
    action: 'resolved',
    performedBy: req.user.id,
    timestamp: new Date(),
    details: 'Complaint resolved'
  });

  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Complaint resolved successfully',
    data: complaint
  });
});

// @desc    Escalate complaint
// @route   PATCH /api/complaints/:id/escalate
// @access  Private
export const escalateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.status = 'escalated';
  complaint.priority = 'critical';
  complaint.timeline.push({
    action: 'escalated',
    performedBy: req.user.id,
    timestamp: new Date(),
    details: 'Complaint escalated to higher priority'
  });

  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Complaint escalated successfully',
    data: complaint
  });
});

// @desc    Get complaints by department
// @route   GET /api/complaints/department/:dept
// @access  Private
export const getComplaintsByDepartment = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ department: req.params.dept })
    .populate('assignedTo', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: complaints.length,
    data: complaints
  });
});

// @desc    Get my assigned complaints
// @route   GET /api/complaints/my/assigned
// @access  Private
export const getMyAssignedComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ assignedTo: req.user.id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: complaints.length,
    data: complaints
  });
});

// @desc    Upload attachment
// @route   POST /api/complaints/:id/attachments
// @access  Private
export const uploadAttachment = asyncHandler(async (req, res) => {
  const { filename, url } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  complaint.attachments.push({
    filename,
    url,
    uploadedAt: new Date()
  });

  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Attachment uploaded successfully',
    data: complaint
  });
});

// @desc    Rate resolved complaint
// @route   POST /api/complaints/:id/rate
// @access  Private
export const rateComplaint = asyncHandler(async (req, res) => {
  const { rating } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  if (complaint.status !== 'resolved') {
    return res.status(400).json({
      success: false,
      message: 'Can only rate resolved complaints'
    });
  }

  complaint.resolution.satisfactionRating = rating;
  await complaint.save();

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: complaint
  });
});
