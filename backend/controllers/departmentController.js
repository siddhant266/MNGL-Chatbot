import Department from "../models/Department.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find()
    .populate('manager', 'name email')
    .populate('agents', 'name email')
    .sort('departmentId');

  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments
  });
});

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id })
    .populate('manager', 'name email phone')
    .populate('agents', 'name email phone');

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  res.status(200).json({
    success: true,
    data: department
  });
});

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
export const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: department
  });
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin/Manager)
export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOneAndUpdate(
    { departmentId: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Department updated successfully',
    data: department
  });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id });

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  await department.remove();

  res.status(200).json({
    success: true,
    message: 'Department deleted successfully'
  });
});

// @desc    Get department statistics
// @route   GET /api/departments/:id/stats
// @access  Private
export const getDepartmentStats = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id });

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  const Complaint = require('../models/Complaint');
  
  const stats = await Complaint.aggregate([
    { $match: { department: req.params.id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        escalated: { $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
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
        },
        avgSatisfactionRating: { $avg: '$resolution.satisfactionRating' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      department: department.departmentId,
      name: department.name,
      stats: stats[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        escalated: 0,
        critical: 0,
        avgResolutionTime: 0,
        avgSatisfactionRating: 0
      }
    }
  });
});

// @desc    Update department metrics
// @route   POST /api/departments/:id/update-metrics
// @access  Private (Admin/Manager)
export const updateDepartmentMetrics = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id });

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  const metrics = await department.updateMetrics();

  res.status(200).json({
    success: true,
    message: 'Department metrics updated successfully',
    data: metrics
  });
});

// @desc    Get department agents
// @route   GET /api/departments/:id/agents
// @access  Private
export const getDepartmentAgents = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id })
    .populate('agents', 'name email phone isActive assignedComplaints');

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  res.status(200).json({
    success: true,
    count: department.agents.length,
    data: department.agents
  });
});

// @desc    Assign agent to department
// @route   POST /api/departments/:id/agents
// @access  Private (Admin/Manager)
export const assignAgentToDepartment = asyncHandler(async (req, res) => {
  const { agentId } = req.body;

  const department = await Department.findOne({ departmentId: req.params.id });
  const agent = await User.findById(agentId);

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: 'Agent not found'
    });
  }

  // Check if agent already assigned
  if (department.agents.includes(agentId)) {
    return res.status(400).json({
      success: false,
      message: 'Agent already assigned to this department'
    });
  }

  department.agents.push(agentId);
  await department.save();

  // Update agent's department
  agent.department = department.departmentId;
  await agent.save();

  res.status(200).json({
    success: true,
    message: 'Agent assigned to department successfully',
    data: department
  });
});

// @desc    Remove agent from department
// @route   DELETE /api/departments/:id/agents/:agentId
// @access  Private (Admin/Manager)
export const removeAgentFromDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ departmentId: req.params.id });

  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }

  department.agents = department.agents.filter(
    agent => agent.toString() !== req.params.agentId
  );
  
  await department.save();

  res.status(200).json({
    success: true,
    message: 'Agent removed from department successfully',
    data: department
  });
});
