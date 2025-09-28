import { Career, CareerPathNode, College, QuizQuestion } from './types';

export const NAV_LINKS = [
  { name: 'Student', path: '/student' },
  { name: 'Parent', path: '/parent' },
  { name: 'Teacher', path: '/teacher' },
  { name: 'Pro', path: '/pro' },
  { name: 'Careers', path: '/careers' },
  { name: 'Paths', path: '/paths' },
  { name: 'About', path: '/about' },
];

export const CAREER_CATEGORIES = [
  'All', 'Technology', 'Design', 'Architecture', 'Engineering', 'Medicine', 'Healthcare', 'Law',
  'Public Service', 'Defense', 'Media', 'Arts', 'Education', 'Business', 'Science', 'Environment',
  'Hospitality', 'Aviation', 'Logistics', 'Social', 'Sports', 'Tourism', 'Trades'
];

export const SUB_CATEGORIES: { [key: string]: string[] } = {
  'Technology': ['Web Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud & DevOps'],
  'Design': ['UI/UX', 'Graphic Design'],
  'Business': ['Finance', 'Marketing', 'Management'],
  'Healthcare': ['Clinical', 'Pharmaceutical'],
  'Media': ['Journalism', 'Broadcasting'],
  'Arts': ['Animation', 'Fine Arts'],
};

export const COLLEGES_DATA: College[] = [
    // Engineering & Technology
    { id: 101, name: 'Indian Institute of Technology, Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Government', annualFees: 220000 },
    { id: 102, name: 'Indian Institute of Technology, Delhi', city: 'New Delhi', state: 'Delhi', type: 'Government', annualFees: 235000 },
    { id: 103, name: 'Indian Institute of Technology, Madras', city: 'Chennai', state: 'Tamil Nadu', type: 'Government', annualFees: 210000 },
    { id: 104, name: 'National Institute of Technology, Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'Government', annualFees: 150000 },
    { id: 105, name: 'Vellore Institute of Technology', city: 'Vellore', state: 'Tamil Nadu', type: 'Private', annualFees: 395000 },
    { id: 106, name: 'International Institute of Information Technology, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Private', annualFees: 400000 },
    { id: 107, name: 'Birla Institute of Technology and Science, Pilani', city: 'Pilani', state: 'Rajasthan', type: 'Private', annualFees: 570000 },
    
    // Design
    { id: 201, name: 'National Institute of Design, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Government', annualFees: 350000 },
    { id: 202, name: 'Industrial Design Centre, IIT Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Government', annualFees: 220000 },
    { id: 203, name: 'Srishti Manipal Institute of Art, Design and Technology', city: 'Bengaluru', state: 'Karnataka', type: 'Private', annualFees: 600000 },

    // Architecture
    { id: 301, name: 'School of Planning and Architecture, Delhi', city: 'New Delhi', state: 'Delhi', type: 'Government', annualFees: 80000 },
    { id: 302, name: 'Sir J. J. College of Architecture', city: 'Mumbai', state: 'Maharashtra', type: 'Government', annualFees: 75000 },

    // Medicine & Healthcare
    { id: 401, name: 'All India Institute of Medical Sciences, Delhi', city: 'New Delhi', state: 'Delhi', type: 'Government', annualFees: 6000 },
    { id: 402, name: 'Christian Medical College, Vellore', city: 'Vellore', state: 'Tamil Nadu', type: 'Private', annualFees: 150000 },
    { id: 403, name: 'Armed Forces Medical College', city: 'Pune', state: 'Maharashtra', type: 'Government', annualFees: 80000 },

    // Law
    { id: 501, name: 'National Law School of India University, Bangalore', city: 'Bengaluru', state: 'Karnataka', type: 'Government', annualFees: 280000 },
    { id: 502, name: 'Symbiosis Law School, Pune', city: 'Pune', state: 'Maharashtra', type: 'Private', annualFees: 400000 },

    // Business & Management
    { id: 601, name: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Government', annualFees: 2300000 },
    { id: 602, name: 'Narsee Monjee Institute of Management Studies', city: 'Mumbai', state: 'Maharashtra', type: 'Private', annualFees: 1000000 },

    // Arts & Humanities
    { id: 701, name: 'St. Stephen\'s College, Delhi University', city: 'New Delhi', state: 'Delhi', type: 'Government', annualFees: 40000 },
    { id: 702, name: 'Loyola College', city: 'Chennai', state: 'Tamil Nadu', type: 'Private', annualFees: 20000 },
    { id: 703, name: 'Jadavpur University', city: 'Kolkata', state: 'West Bengal', type: 'Government', annualFees: 10000 },
    
    // AICTE / AISHE examples for variety
    { id: 801, name: 'Pune Institute of Computer Technology', city: 'Pune', state: 'Maharashtra', type: 'AICTE Approved', annualFees: 120000 },
    { id: 802, name: 'Amity University, Noida', city: 'Noida', state: 'Uttar Pradesh', type: 'AISHE', annualFees: 350000 },
];


export const CAREERS_DATA: Career[] = [
  { id: 1, title: 'Software Engineer', category: 'Technology', subcategory: 'Web Development', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105, 106, 107, 801, 802] },
  { id: 2, title: 'Frontend Developer', category: 'Technology', subcategory: 'Web Development', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105, 106, 107, 801, 802] },
  { id: 3, title: 'Backend Developer', category: 'Technology', subcategory: 'Web Development', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105, 106, 107] },
  { id: 4, title: 'Full-Stack Developer', category: 'Technology', subcategory: 'Web Development', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105, 106, 107, 801] },
  { id: 5, title: 'Mobile App Developer', category: 'Technology', subcategory: 'Web Development', bookmarked: false, relatedCollegeIds: [101, 102, 105, 107, 802] },
  { id: 6, title: 'Data Scientist', category: 'Technology', subcategory: 'Data Science', bookmarked: false, relatedCollegeIds: [101, 102, 103, 106, 107] },
  { id: 7, title: 'Data Analyst', category: 'Technology', subcategory: 'Data Science', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105, 601, 602] },
  { id: 8, title: 'Machine Learning Engineer', category: 'Technology', subcategory: 'AI/ML', bookmarked: false, relatedCollegeIds: [101, 102, 103, 106] },
  { id: 9, title: 'AI Researcher', category: 'Technology', subcategory: 'AI/ML', bookmarked: false, relatedCollegeIds: [101, 102, 103, 106] },
  { id: 10, title: 'Cybersecurity Analyst', category: 'Technology', subcategory: 'Cybersecurity', bookmarked: false, relatedCollegeIds: [101, 102, 104, 105, 801, 802] },
  { id: 11, title: 'Cloud Architect', category: 'Technology', subcategory: 'Cloud & DevOps', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 107] },
  { id: 12, title: 'DevOps Engineer', category: 'Technology', subcategory: 'Cloud & DevOps', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 107, 801] },
  { id: 13, title: 'UI/UX Designer', category: 'Design', subcategory: 'UI/UX', bookmarked: false, relatedCollegeIds: [201, 202, 203] },
  { id: 14, title: 'Graphic Designer', category: 'Design', subcategory: 'Graphic Design', bookmarked: false, relatedCollegeIds: [201, 203, 703] },
  { id: 15, title: 'Architect', category: 'Architecture', subcategory: 'Architecture', bookmarked: false, relatedCollegeIds: [301, 302] },
  { id: 16, title: 'Civil Engineer', category: 'Engineering', subcategory: 'Engineering', bookmarked: false, relatedCollegeIds: [101, 102, 103, 104, 105] },
  { id: 17, title: 'Doctor', category: 'Medicine', subcategory: 'Medicine', bookmarked: false, relatedCollegeIds: [401, 402, 403] },
  { id: 18, title: 'Nurse', category: 'Healthcare', subcategory: 'Clinical', bookmarked: false, relatedCollegeIds: [401, 402, 403] },
  { id: 19, title: 'Lawyer', category: 'Law', subcategory: 'Law', bookmarked: false, relatedCollegeIds: [501, 502] },
  { id: 20, title: 'Teacher', category: 'Education', subcategory: 'Education', bookmarked: false, relatedCollegeIds: [701, 702, 703] },
  { id: 21, title: 'Marketing Manager', category: 'Business', subcategory: 'Marketing', bookmarked: false, relatedCollegeIds: [601, 602, 701] },
  { id: 22, title: 'Financial Analyst', category: 'Business', subcategory: 'Finance', bookmarked: false, relatedCollegeIds: [601, 602, 701] },
  { id: 23, title: 'Pharmacist', category: 'Healthcare', subcategory: 'Pharmaceutical', bookmarked: false, relatedCollegeIds: [401, 402] },
  { id: 24, title: 'Journalist', category: 'Media', subcategory: 'Journalism', bookmarked: false, relatedCollegeIds: [701, 702, 703] },
  { id: 25, title: 'Animator', category: 'Arts', subcategory: 'Animation', bookmarked: false, relatedCollegeIds: [201, 203, 703] },
];

const SOFTWARE_ENGINEER_PATH: CareerPathNode = {
  id: 'se-root',
  name: 'Foundation',
  description: 'Start with a solid educational foundation in computer science or a related field.',
  skills: ['Problem Solving', 'Basic Programming', 'Mathematics'],
  education: ['High School Diploma'],
  children: [
    {
      id: 'se-bachelors',
      name: "Bachelor's Degree",
      description: 'Pursue a degree in Computer Science, Software Engineering, or a similar technical discipline.',
      skills: ['Data Structures', 'Algorithms', 'Object-Oriented Programming', 'Databases'],
      education: ['B.S. in Computer Science (or equivalent)'],
      children: [
        {
          id: 'se-intern',
          name: 'Internship / Junior Developer',
          description: 'Gain practical experience through internships or entry-level roles. This is where you apply academic knowledge to real-world problems.',
          skills: ['Version Control (Git)', 'Web Frameworks (React, Node.js, etc.)', 'Agile Methodologies', 'Testing'],
          education: ['On-the-job training'],
          children: [
            {
              id: 'se-mid-level',
              name: 'Software Engineer',
              description: 'Become a core contributor to projects, taking on more complex tasks and responsibilities with growing autonomy.',
              skills: ['System Design (Basic)', 'Cloud Services (AWS, Azure, GCP)', 'CI/CD', 'Code Review'],
              education: ['Certifications (Optional)'],
              children: [
                {
                  id: 'se-senior',
                  name: 'Senior Software Engineer',
                  description: 'Lead technical projects, mentor junior developers, and make significant architectural decisions.',
                  skills: ['Advanced System Design', 'Project Leadership', 'Mentoring', 'Performance Optimization'],
                  education: ['Continuous learning'],
                  children: [
                    {
                      id: 'se-lead',
                      name: 'Tech Lead / Staff Engineer',
                      description: 'Drive the technical direction for a team or a major project area. Deep technical expertise is key.',
                      skills: ['Technical Strategy', 'Cross-team Collaboration', 'Architectural Design'],
                      education: [],
                    },
                    {
                      id: 'se-manager',
                      name: 'Engineering Manager',
                      description: 'Shift focus to people management, team growth, and project execution. Requires strong leadership and organizational skills.',
                      skills: ['People Management', 'Project Management', 'Hiring & Recruiting', 'Career Development'],
                      education: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const UI_UX_DESIGN_PATH: CareerPathNode = {
    id: 'ux-root',
    name: 'Foundation',
    description: 'Develop a strong base in design principles, visual arts, and communication.',
    skills: ['Creativity', 'Empathy', 'Visual Communication'],
    education: ['High School Diploma'],
    children: [
        {
            id: 'ux-degree',
            name: 'Degree or Certification',
            description: 'Obtain formal education in Graphic Design, Human-Computer Interaction, or a related field. Bootcamps and certifications are also popular.',
            skills: ['Design Principles', 'Color Theory', 'Typography', 'User Research Basics'],
            education: ['B.A. in Design, HCI, or Certification'],
            children: [
                {
                    id: 'ux-intern',
                    name: 'Design Intern / Junior Designer',
                    description: 'Start by working on smaller projects, creating wireframes, mockups, and prototypes under the guidance of senior designers.',
                    skills: ['Figma / Sketch / Adobe XD', 'Wireframing', 'Prototyping', 'User Flows'],
                    education: ['Portfolio Development'],
                    children: [
                        {
                            id: 'ux-designer',
                            name: 'UI/UX Designer',
                            description: 'Take ownership of design projects, conduct user research, and collaborate with product managers and engineers to build user-centric products.',
                            skills: ['User Research', 'Usability Testing', 'Interaction Design', 'Design Systems'],
                            education: ['On-the-job experience'],
                            children: [
                                {
                                    id: 'ux-senior',
                                    name: 'Senior UI/UX Designer',
                                    description: 'Lead design for major product features, mentor other designers, and contribute to the overall design strategy.',
                                    skills: ['Design Leadership', 'Mentoring', 'Product Strategy', 'Advanced Research'],
                                    education: [],
                                    children: [
                                        {
                                            id: 'ux-lead',
                                            name: 'Design Lead / Principal Designer',
                                            description: 'Oversee the design direction for a product area or team, ensuring high standards and a cohesive user experience.',
                                            skills: ['Design Strategy', 'Team Leadership', 'Stakeholder Management'],
                                            education: [],
                                        },
                                        {
                                            id: 'ux-manager',
                                            name: 'Design Manager',
                                            description: 'Focus on managing a team of designers, fostering their growth, and aligning design efforts with business goals.',
                                            skills: ['People Management', 'Project Scoping', 'Hiring', 'Design Operations'],
                                            education: [],
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

const DOCTOR_PATH: CareerPathNode = {
  id: 'doc-root',
  name: 'Foundation (Class 11-12)',
  description: 'Focus on Physics, Chemistry, and Biology (PCB) stream and prepare for medical entrance exams.',
  skills: ['Scientific Aptitude', 'Memorization', 'Discipline'],
  education: ['Higher Secondary (PCB)'],
  children: [
    {
      id: 'doc-mbbs',
      name: "MBBS Degree",
      description: 'Complete a 5.5-year undergraduate medical degree (Bachelor of Medicine, Bachelor of Surgery), including a mandatory one-year internship.',
      skills: ['Anatomy', 'Physiology', 'Biochemistry', 'Clinical Skills', 'Patient Interaction'],
      education: ['MBBS from a recognized medical college (via NEET UG)'],
      children: [
        {
          id: 'doc-pg',
          name: 'Post-Graduation (MD/MS)',
          description: 'Pursue a 3-year postgraduate specialization (Doctor of Medicine or Master of Surgery) in a specific medical field.',
          skills: ['Specialized Medical Knowledge', 'Diagnostic Skills', 'Surgical Skills (for MS)', 'Research Methodology'],
          education: ['MD/MS from a recognized medical college (via NEET PG)'],
          children: [
            {
              id: 'doc-resident',
              name: 'Senior Resident / Consultant',
              description: 'Work in a hospital or clinic, applying specialized knowledge to treat patients. This involves diagnosis, treatment planning, and patient care.',
              skills: ['Advanced Diagnostics', 'Patient Management', 'Medical Ethics', 'Team Collaboration'],
              education: ['Post-residency experience'],
              children: [
                {
                  id: 'doc-super',
                  name: 'Super Specialization (DM/MCh)',
                  description: 'For further specialization, pursue a 3-year Doctorate of Medicine (DM) or Master of Chirurgiae (MCh) in a sub-specialty.',
                  skills: ['Sub-specialty Expertise', 'Advanced Research', 'Mentoring Junior Doctors'],
                  education: ['DM/MCh (via NEET SS)'],
                },
                {
                  id: 'doc-practice',
                  name: 'Private Practice / Hospital Head',
                  description: 'Establish a private practice or take on a leadership role within a hospital, such as Head of Department.',
                  skills: ['Clinical Leadership', 'Hospital Administration', 'Business Management (for private practice)'],
                  education: ['Extensive clinical experience'],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};


export const CAREER_PATHS: { [key: string]: { name: string, data: CareerPathNode } } = {
    'software': {
        name: 'Software Engineering',
        data: SOFTWARE_ENGINEER_PATH
    },
    'design': {
        name: 'UI/UX Design',
        data: UI_UX_DESIGN_PATH
    },
    'doctor': {
        name: 'Medical Doctor (MBBS to Specialist)',
        data: DOCTOR_PATH
    }
};

export const STAGED_QUIZ_DATA: { [key: string]: QuizQuestion[] } = {
    'Grade 10': [
        { id: 1, question: "Which subject area fascinates you the most?", options: ["Science & Technology", "Arts & Humanities", "Commerce & Business", "I'm still exploring everything"] },
        { id: 2, question: "When you have free time, you prefer to:", options: ["Build or tinker with things (like code or electronics)", "Read, write, or create art", "Learn about the economy or how businesses work", "Help others or volunteer in your community"] },
        { id: 3, question: "I enjoy tasks that involve:", options: ["Logical reasoning and problem-solving", "Creativity and self-expression", "Planning and organizing", "Understanding people and society"] },
        { id: 4, question: "Looking ahead 5 years, what sounds most appealing?", options: ["Creating new technologies", "Expressing ideas through creative work", "Leading a successful business or project", "Making a direct impact on people's lives"] },
        { id: 5, question: "Which stream are you leaning towards after 10th grade?", options: ["Science (PCM/PCB)", "Commerce", "Arts/Humanities", "I'm undecided"] }
    ],
    'Grade 12': [
        { id: 1, question: "Which of your current subjects do you excel at and enjoy the most?", options: ["Physics, Chemistry, Maths (PCM)", "Physics, Chemistry, Biology (PCB)", "Business, Accounts, Economics", "History, Literature, Political Science"] },
        { id: 2, question: "What kind of professional environment excites you?", options: ["A fast-paced tech company or research lab", "A hospital, clinic, or healthcare setting", "A corporate office or a startup", "A creative studio, a university, or a government office"] },
        { id: 3, question: "When preparing for entrance exams, you're focusing on:", options: ["Engineering (e.g., JEE)", "Medical (e.g., NEET)", "Business/Law (e.g., CLAT, IPMAT)", "University-specific entrance tests (e.g., CUET)"] },
        { id: 4, question: "Your ideal job would involve:", options: ["Designing and building innovative products or systems", "Diagnosing and solving complex human problems", "Managing resources and driving growth", "Researching, teaching, or advocating for a cause"] },
        { id: 5, question: "After your Bachelor's degree, you envision yourself:", options: ["Pursuing a Master's or PhD in a specialized technical field", "Working directly with patients or in a health-related field", "Climbing the corporate ladder or starting your own venture", "Contributing to academia, policy-making, or creative industries"] }
    ],
    'College': [
        { id: 1, question: "What is your current or intended field of study in college?", options: ["Engineering / Computer Science", "Medicine / Life Sciences", "Business / Economics", "Arts / Humanities / Social Sciences"] },
        { id: 2, question: "Which aspect of your field are you most passionate about specializing in?", options: ["Developing cutting-edge technology (e.g., AI, Robotics)", "Clinical practice or biomedical research", "Financial markets, marketing, or entrepreneurship", "Academic research, public policy, or creative expression"] },
        { id: 3, question: "What kind of impact do you want to make in your career?", options: ["Technological innovation that changes how we live and work", "Improving human health and well-being", "Creating economic value and opportunities", "Shaping culture, society, and knowledge"] },
        { id: 4, question: "Are you more interested in a corporate role or pursuing further higher education (Masters/PhD)?", options: ["Enter the job market immediately after graduation", "Pursue a Master's degree for specialization", "Aim for a PhD for a career in research or academia", "A mix of both - work for a few years, then higher studies"] },
        { id: 5, question: "What kind of practical experience are you seeking during college?", options: ["Tech internships at software companies", "Clinical rotations or lab research assistantships", "Business internships in finance, marketing, or operations", "NGO volunteering, research projects, or creative portfolios"] }
    ],
};