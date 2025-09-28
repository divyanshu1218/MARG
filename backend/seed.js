// seed.js - Sample test data for LEHER Backend
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Mentor = require('./models/Mentor');
const Session = require('./models/Session');
const Resource = require('./models/Resource');
const Quiz = require('./models/Quiz');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Mentor.deleteMany();
    await Session.deleteMany();
    await Resource.deleteMany();
    await Quiz.deleteMany();

    // Drop indexes to avoid conflicts
    try {
      await Resource.collection.dropIndexes();
    } catch (e) {
      // Ignore if no indexes
    }

    console.log('Cleared existing data...');

    // Sample Users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@marg.com',
        password: hashedPassword,
        role: 'Admin',
        bio: 'Platform administrator',
        isActive: true
      },
      {
        name: 'Student User',
        email: 'student@marg.com',
        password: hashedPassword,
        role: 'Student',
        bio: 'High school student seeking career guidance',
        class: '12',
        board: 'CBSE',
        subjects: ['Math', 'Physics', 'Chemistry'],
        grades: new Map([['Math', 'A'], ['Physics', 'B+'], ['Chemistry', 'A']]),
        careerInterests: ['Engineering', 'Technology'],
        location: 'Mumbai, India',
        isActive: true
      },
      {
        name: 'Teacher User',
        email: 'teacher@marg.com',
        password: hashedPassword,
        role: 'Teacher',
        bio: 'School teacher',
        education: 'B.Ed',
        institutionName: 'Delhi Public School',
        institutionType: 'School',
        isActive: true
      },
      {
        name: 'Mentor John',
        email: 'mentor1@marg.com',
        password: hashedPassword,
        role: 'Mentor',
        bio: 'Experienced software engineer and career mentor',
        education: 'B.Tech IIT',
        expertise: ['Software Engineering', 'Career Counseling'],
        hourlyRate: 500,
        availability: ['Mon 10-12', 'Wed 2-4'],
        isActive: true
      },
      {
        name: 'Mentor Jane',
        email: 'mentor2@marg.com',
        password: hashedPassword,
        role: 'Mentor',
        bio: 'Doctor and medical career advisor',
        education: 'MBBS',
        expertise: ['Medicine', 'Medical Entrance Prep'],
        hourlyRate: 800,
        availability: ['Tue 3-5', 'Fri 1-3'],
        isActive: true
      }
    ];

    const insertedUsers = await User.insertMany(users);
    console.log('Sample users created...');

    // Sample Mentors (linked to mentor users)
    const mentorData = [
      {
        user: insertedUsers[3]._id, // Mentor John
        expertise: ['Software Engineering', 'Career Counseling'],
        experience: '5 years in software development',
        qualifications: ['B.Tech IIT', 'Certified Career Counselor'],
        availability: { monday: ['10-12'], wednesday: ['14-16'] },
        hourlyRate: 500,
        isVetted: false,
        languages: ['English', 'Hindi'],
        specializations: ['Engineering', 'IT']
      },
      {
        user: insertedUsers[4]._id, // Mentor Jane
        expertise: ['Medicine', 'Medical Entrance Prep'],
        experience: '8 years as practicing doctor',
        qualifications: ['MBBS', 'MD'],
        availability: { tuesday: ['15-17'], friday: ['13-15'] },
        hourlyRate: 800,
        isVetted: true,
        languages: ['English', 'Hindi'],
        specializations: ['Medicine', 'NEET']
      }
    ];

    const insertedMentors = await Mentor.insertMany(mentorData);
    console.log('Sample mentors created...');

    // Sample Sessions
    const sessions = [
      {
        student: insertedUsers[1]._id, // Student user
        mentor: insertedMentors[0]._id,
        date: new Date('2024-01-15'),
        time: '10:00 AM',
        duration: 60,
        status: 'pending',
        roomId: 'session_room_1',
        notes: 'Discuss engineering career paths'
      },
      {
        student: insertedUsers[1]._id,
        mentor: insertedMentors[1]._id,
        date: new Date('2024-01-20'),
        time: '3:00 PM',
        duration: 45,
        status: 'completed',
        roomId: 'session_room_2',
        notes: 'NEET preparation tips'
      }
    ];

    await Session.insertMany(sessions);
    console.log('Sample sessions created...');

    // Sample Quizzes
    const quizzes = [
      {
        userId: insertedUsers[1]._id, // Student
        questions: [
          {
            question: 'What is your favorite subject?',
            options: ['Math', 'Science', 'English', 'History'],
            category: 'Interest',
            weight: 1
          },
          {
            question: 'Rate your interest in technology (1-5)',
            category: 'Aptitude',
            weight: 1
          }
        ],
        responses: [
          { questionIndex: 0, answer: 'Math', score: 5 },
          { questionIndex: 1, answer: 4, score: 4 }
        ],
        results: {
          careerClusters: [
            { cluster: 'Engineering', score: 8, percentage: 80 },
            { cluster: 'Medical', score: 2, percentage: 20 }
          ],
          recommendedCareers: ['Software Engineer', 'Data Scientist'],
          strengths: ['Logical Thinking', 'Problem Solving'],
          suggestions: ['Consider STEM fields']
        },
        isCompleted: true,
        completedAt: new Date()
      }
    ];

    await Quiz.insertMany(quizzes);
    console.log('Sample quizzes created...');

    // Sample Resources
    const resources = [
      {
        title: 'Introduction to Software Engineering Careers',
        content: 'A comprehensive guide to software engineering careers...',
        author: insertedUsers[2]._id, // Teacher user
        category: 'engineering',
        tags: ['software', 'coding', 'IT'],
        isVerified: true,
        source: 'Verified-Institution',
        likes: [insertedUsers[1]._id], // Array of user IDs, add more if needed
        comments: [
          {
            user: insertedUsers[1]._id,
            text: 'Very helpful guide!',
            createdAt: new Date()
          }
        ]
      },
      {
        title: 'Preparing for Medical Entrance Exams',
        content: 'Tips and strategies for NEET and other medical exams...',
        author: insertedUsers[2]._id,
        category: 'medicine',
        tags: ['NEET', 'medical', 'exams'],
        isVerified: false,
        source: 'User',
        likes: [insertedUsers[0]._id], // Sample like
        comments: []
      }
    ];

    await Resource.insertMany(resources);
    console.log('Sample resources created...');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
