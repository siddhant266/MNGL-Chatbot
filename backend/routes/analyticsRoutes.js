import express from "express";
import * as analyticsController from "../controllers/analyticsController.js";
import { authMiddleware as protect, isAdmin as authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

// Dashboard overview
router.get('/dashboard', analyticsController.getDashboardOverview);

// Department-wise statistics
router.get('/departments', analyticsController.getDepartmentAnalytics);

// Trend analysis
router.get('/trends', analyticsController.getTrendAnalysis);

// Category distribution
router.get('/categories', analyticsController.getCategoryDistribution);

// Priority distribution
router.get('/priorities', analyticsController.getPriorityDistribution);

// Resolution time analysis
router.get('/resolution-time', analyticsController.getResolutionTimeAnalysis);

// SLA compliance
router.get('/sla-compliance', analyticsController.getSLACompliance);

// Agent performance
router.get('/agent-performance', authorize('manager', 'admin'), analyticsController.getAgentPerformance);

// Export reports (admin, manager)
router.get('/export', authorize('admin', 'manager'), analyticsController.exportReport);

// Custom date range analytics
router.post('/custom-range', analyticsController.getCustomRangeAnalytics);

// Real-time metrics
router.get('/realtime', analyticsController.getRealtimeMetrics);

export default router;
