import mongoose from "mongoose";
import dotenv from "dotenv";

import Department from "../models/Department.js";
import User from "../models/user.js";
import Complaint from "../models/Complaint.js";


dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URL);


// Department Data
const departments = [
  {
    departmentId: 'ORM',
    name: 'ORM',
    fullName: 'Operations & Risk Management',
    description: 'Handles operational processes and risk mitigation',
    icon: '⚙️',
    color: '#FF6B35',
    settings: {
      autoAssignment: true,
      maxComplaintsPerAgent: 25,
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  {
    departmentId: 'RRM',
    name: 'RRM',
    fullName: 'Reputation & Relationship Management',
    description: 'Manages public relations and stakeholder relationships',
    icon: '🤝',
    color: '#F7931E',
    settings: {
      autoAssignment: true,
      maxComplaintsPerAgent: 20,
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  {
    departmentId: 'CRM',
    name: 'CRM',
    fullName: 'Customer Relationship Management',
    description: 'Focuses on customer satisfaction and retention',
    icon: '👥',
    color: '#4ECDC4',
    settings: {
      autoAssignment: true,
      maxComplaintsPerAgent: 30,
      workingHours: { start: '08:00', end: '20:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  {
    departmentId: 'IT',
    name: 'IT',
    fullName: 'Information Technology',
    description: 'Handles technical issues and system maintenance',
    icon: '💻',
    color: '#556FB5',
    settings: {
      autoAssignment: true,
      maxComplaintsPerAgent: 20,
      workingHours: { start: '00:00', end: '23:59' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  },
  {
    departmentId: 'PROJECT',
    name: 'PROJECT',
    fullName: 'Project Management',
    description: 'Oversees project delivery and coordination',
    icon: '📊',
    color: '#C44569',
    settings: {
      autoAssignment: true,
      maxComplaintsPerAgent: 15,
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  }
];

// User Data
const users = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "123456",
    contactNumber: "9876543210",
    role: "admin"
  }
];


// Sample Complaint Data
const generateComplaints = (userIds) => {
  const titles = [
    'Unable to access customer portal',
    'Payment not processed correctly',
    'Service quality below expectations',
    'System timeout during peak hours',
    'Project delivery delayed',
    'Billing discrepancy in invoice',
    'Technical support response time too slow',
    'Data synchronization issues',
    'Missing features in latest update',
    'Communication breakdown with team'
  ];

  const descriptions = [
    'Customer is unable to log into their account despite correct credentials.',
    'Payment was deducted but transaction shows as failed in the system.',
    'Multiple complaints received about service quality declining recently.',
    'System becomes unresponsive during high traffic periods.',
    'Project milestone was not met due to resource constraints.',
    'Invoice shows incorrect amount compared to agreed pricing.',
    'Average response time from support team exceeds SLA requirements.',
    'Data not syncing properly between mobile and web applications.',
    'Promised features from roadmap are missing in the new release.',
    'Team members not receiving important project updates.'
  ];

  const categories = ['Service Quality', 'Technical Issues', 'Billing', 'Delivery', 'Communication'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['pending', 'in-progress', 'resolved', 'escalated'];
  const departments = ['ORM', 'RRM', 'CRM', 'IT', 'PROJECT'];

  const complaints = [];
  
  for (let i = 0; i < 50; i++) {
    const randomDays = Math.floor(Math.random() * 60);
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - randomDays);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const complaint = {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priority,
      status: status,
      reportedBy: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+123456${7000 + i}`
      },
      createdAt: createdDate
    };

    // If status is resolved, add resolution details
    if (status === 'resolved') {
      const resolvedDate = new Date(createdDate);
      resolvedDate.setDate(resolvedDate.getDate() + Math.floor(Math.random() * 10) + 1);
      
      complaint.resolution = {
        resolvedBy: userIds[Math.floor(Math.random() * userIds.length)],
        resolvedAt: resolvedDate,
        resolutionNote: 'Issue has been successfully resolved.',
        satisfactionRating: Math.floor(Math.random() * 3) + 3 // 3-5 stars
      };
    }

    // Randomly assign to an agent
    if (Math.random() > 0.3) {
      complaint.assignedTo = userIds[Math.floor(Math.random() * userIds.length)];
    }

    complaints.push(complaint);
  }

  return complaints;
};

// Import Data
const importData = async () => {
  try {
    console.log('🔄 Starting data import...');

    // Clear existing data
    await Department.deleteMany();
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log('✅ Cleared existing data');

    // Import Departments
    const createdDepartments = await Department.insertMany(departments);
    console.log('✅ Departments imported');

    // Import Users
    const createdUsers = await User.insertMany(users);
    console.log('✅ Users imported');

    // Get user IDs for complaints
    const userIds = createdUsers.map(user => user._id);

    // Import Complaints
    const complaints = generateComplaints(userIds);
    await Complaint.insertMany(complaints);
    console.log('✅ Complaints imported');

    console.log('✅ Data import completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@complaint-system.com / admin123');
    console.log('Manager: john.manager@complaint-system.com / manager123');
    console.log('Agent: sarah.agent@complaint-system.com / agent123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    console.log('🔄 Deleting all data...');
    
    await Department.deleteMany();
    await User.deleteMany();
    await Complaint.deleteMany();
    
    console.log('✅ All data deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please specify an option:');
  console.log('  -i : Import data');
  console.log('  -d : Delete data');
  console.log('\nExample: node config/seeder.js -i');
  process.exit(0);
}
