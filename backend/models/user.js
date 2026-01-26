import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
    },
    bpNumber: {
        type: String,
        unique: true,
        uppercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate BP Number before saving
userSchema.pre('save', async function () {
    if (!this.isNew) {
        this.updatedAt = Date.now();
        return;
    }

    // Generate unique BP Number
    if (!this.bpNumber) {
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            // Format: MNGL-YYYY-XXXXX (XXXXX = random 5-digit number)
            const year = new Date().getFullYear();
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const generatedBP = `MNGL-${year}-${randomNum}`;

            // Check if BP number already exists
            const existingUser = await mongoose.models.User.findOne({ bpNumber: generatedBP });

            if (!existingUser) {
                this.bpNumber = generatedBP;
                isUnique = true;
            }

            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate unique BP Number');
        }
    }

    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.model("User", userSchema);