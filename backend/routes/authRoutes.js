import express from "express";
import { body } from "express-validator";
import {
    signup,
    login,
    getProfile,
    updateProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation rules
const signupValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('contactNumber')
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit contact number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('password')
        .notEmpty().withMessage('Password is required'),

    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.bpNumber) {
            throw new Error('Please provide either email or BP Number');
        }
        return true;
    })
];

// Routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;