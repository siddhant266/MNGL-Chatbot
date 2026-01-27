import express from "express";
import * as complaintController from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();

// Public routes
router.post('/create', complaintController.createComplaint);

// Protected routes - require authentication
router.use(protect);

// Get all complaints with filters
router.get('/', authorize('admin', 'manager'), complaintController.getAllComplaints);

// Get single complaint
router.get('/:id', authorize('admin', 'manager'), complaintController.getComplaintById);

// Update complaint
router.put('/:id', authorize('admin', 'manager'), complaintController.updateComplaint);

// Delete complaint (admin only)
router.delete('/:id', authorize('admin', 'manager'), complaintController.deleteComplaint);

// Update complaint status
router.patch('/:id/status', complaintController.updateComplaintStatus);

// Assign complaint to agent
router.patch('/:id/assign', authorize('manager', 'admin'), complaintController.assignComplaint);

// Add comment to complaint
router.post('/:id/comments', complaintController.addComment);

// Resolve complaint
router.patch('/:id/resolve', complaintController.resolveComplaint);

// Escalate complaint
router.patch('/:id/escalate', complaintController.escalateComplaint);

// Get complaints by department
router.get('/department/:dept', complaintController.getComplaintsByDepartment);

// Get my assigned complaints
router.get('/my/assigned', complaintController.getMyAssignedComplaints);

// Upload attachment
router.post('/:id/attachments', complaintController.uploadAttachment);

// Rate resolved complaint
router.post('/:id/rate', complaintController.rateComplaint);

export default router;
