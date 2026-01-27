import express from "express";
import * as departmentController from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();

// Get all departments (public)
router.get('/', departmentController.getAllDepartments);

// Get single department
router.get('/:id', departmentController.getDepartmentById);

// Protected routes
router.use(protect);

// Create department (admin only)
router.post('/', authorize('admin'), departmentController.createDepartment);

// Update department (admin, manager)
router.put('/:id', authorize('admin', 'manager'), departmentController.updateDepartment);

// Delete department (admin only)
router.delete('/:id', authorize('admin'), departmentController.deleteDepartment);

// Get department statistics
router.get('/:id/stats', departmentController.getDepartmentStats);

// Update department metrics
router.post('/:id/update-metrics', authorize('admin', 'manager'), departmentController.updateDepartmentMetrics);

// Get department agents
router.get('/:id/agents', departmentController.getDepartmentAgents);

// Assign agent to department
router.post('/:id/agents', authorize('admin', 'manager'), departmentController.assignAgentToDepartment);

// Remove agent from department
router.delete('/:id/agents/:agentId', authorize('admin', 'manager'), departmentController.removeAgentFromDepartment);

export default router;
