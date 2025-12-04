import { connectDB } from "../src/lib/db";
import User from "../src/models/User";
import Course from "../src/models/Course";

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp 2024",
    slug: "complete-web-development-bootcamp-2024",
    description: `Master web development from scratch! This comprehensive bootcamp covers everything you need to become a full-stack web developer.

You'll learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and more. Build real-world projects and gain the skills employers are looking for.

Whether you're a complete beginner or looking to level up your skills, this course will take you from zero to hero in web development.`,
    shortDescription: "Learn HTML, CSS, JavaScript, React, Node.js & MongoDB. Build real projects and become a full-stack developer.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    previewVideo: "",
    category: "Web Development",
    level: "beginner" as const,
    price: 99.99,
    discountPrice: 49.99,
    isFeatured: true,
    isPublished: true,
    modules: [
      {
        title: "Getting Started with Web Development",
        order: 1,
        lessons: [
          { title: "Course Introduction", type: "video" as const, duration: 5, isFree: true, order: 1 },
          { title: "How the Web Works", type: "video" as const, duration: 12, isFree: true, order: 2 },
          { title: "Setting Up Your Development Environment", type: "video" as const, duration: 15, isFree: false, order: 3 },
        ],
      },
      {
        title: "HTML Fundamentals",
        order: 2,
        lessons: [
          { title: "HTML Basics", type: "video" as const, duration: 20, isFree: false, order: 1 },
          { title: "HTML Structure & Semantics", type: "video" as const, duration: 18, isFree: false, order: 2 },
          { title: "Forms and Input Elements", type: "video" as const, duration: 25, isFree: false, order: 3 },
          { title: "HTML Practice Quiz", type: "quiz" as const, duration: 10, isFree: false, order: 4 },
        ],
      },
      {
        title: "CSS Mastery",
        order: 3,
        lessons: [
          { title: "CSS Fundamentals", type: "video" as const, duration: 22, isFree: false, order: 1 },
          { title: "Flexbox Layout", type: "video" as const, duration: 30, isFree: false, order: 2 },
          { title: "CSS Grid", type: "video" as const, duration: 28, isFree: false, order: 3 },
          { title: "Responsive Design", type: "video" as const, duration: 35, isFree: false, order: 4 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Build professional websites from scratch",
      "Master HTML5 and CSS3",
      "Create responsive layouts with Flexbox and Grid",
      "Build dynamic web apps with JavaScript",
      "Develop full-stack applications with React and Node.js",
    ],
    requirements: [
      "No prior programming experience required",
      "A computer with internet access",
      "Eagerness to learn",
    ],
    rating: 4.8,
    reviewCount: 1234,
    enrolledCount: 5678,
  },
  {
    title: "React - The Complete Guide 2024",
    slug: "react-complete-guide-2024",
    description: `Dive deep into React.js and learn how to build modern, scalable web applications.

This course covers React fundamentals, hooks, state management with Redux, routing, testing, and deploying React applications.

You'll build multiple projects including a complete e-commerce application from scratch.`,
    shortDescription: "Master React.js with hooks, Redux, React Router, and more. Build production-ready applications.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "Web Development",
    level: "intermediate" as const,
    price: 89.99,
    discountPrice: 44.99,
    isFeatured: true,
    isPublished: true,
    modules: [
      {
        title: "React Basics",
        order: 1,
        lessons: [
          { title: "What is React?", type: "video" as const, duration: 8, isFree: true, order: 1 },
          { title: "Creating Your First React App", type: "video" as const, duration: 15, isFree: true, order: 2 },
          { title: "JSX Deep Dive", type: "video" as const, duration: 20, isFree: false, order: 3 },
        ],
      },
      {
        title: "React Hooks",
        order: 2,
        lessons: [
          { title: "useState Hook", type: "video" as const, duration: 18, isFree: false, order: 1 },
          { title: "useEffect Hook", type: "video" as const, duration: 22, isFree: false, order: 2 },
          { title: "Custom Hooks", type: "video" as const, duration: 25, isFree: false, order: 3 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Build powerful React applications",
      "Master React Hooks",
      "State management with Redux Toolkit",
      "React Router for navigation",
      "Testing React components",
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "HTML and CSS fundamentals",
      "Understanding of ES6+ features",
    ],
    rating: 4.9,
    reviewCount: 892,
    enrolledCount: 3456,
  },
  {
    title: "Python for Data Science and Machine Learning",
    slug: "python-data-science-machine-learning",
    description: `Learn Python programming and use it for data science and machine learning projects.

This comprehensive course covers Python basics, NumPy, Pandas, data visualization with Matplotlib and Seaborn, and machine learning with Scikit-Learn.`,
    shortDescription: "Master Python for data analysis, visualization, and machine learning with hands-on projects.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    category: "Data Science",
    level: "beginner" as const,
    price: 119.99,
    discountPrice: 59.99,
    isFeatured: true,
    isPublished: true,
    modules: [
      {
        title: "Python Fundamentals",
        order: 1,
        lessons: [
          { title: "Introduction to Python", type: "video" as const, duration: 10, isFree: true, order: 1 },
          { title: "Variables and Data Types", type: "video" as const, duration: 15, isFree: true, order: 2 },
          { title: "Control Flow", type: "video" as const, duration: 20, isFree: false, order: 3 },
          { title: "Functions", type: "video" as const, duration: 25, isFree: false, order: 4 },
        ],
      },
      {
        title: "Data Analysis with Pandas",
        order: 2,
        lessons: [
          { title: "Introduction to Pandas", type: "video" as const, duration: 18, isFree: false, order: 1 },
          { title: "Data Manipulation", type: "video" as const, duration: 30, isFree: false, order: 2 },
          { title: "Data Cleaning", type: "video" as const, duration: 28, isFree: false, order: 3 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Python programming from basics to advanced",
      "Data analysis with NumPy and Pandas",
      "Data visualization with Matplotlib",
      "Machine learning with Scikit-Learn",
      "Real-world data science projects",
    ],
    requirements: [
      "No prior programming experience needed",
      "Basic math knowledge helpful",
      "Computer with internet access",
    ],
    rating: 4.7,
    reviewCount: 567,
    enrolledCount: 2345,
  },
  {
    title: "AWS Certified Solutions Architect",
    slug: "aws-certified-solutions-architect",
    description: `Prepare for the AWS Certified Solutions Architect exam with this comprehensive course.

Learn about AWS services, architecture best practices, security, and cost optimization. Includes practice exams and hands-on labs.`,
    shortDescription: "Pass the AWS Solutions Architect exam with hands-on labs and practice tests.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
    category: "Cloud Computing",
    level: "intermediate" as const,
    price: 149.99,
    discountPrice: 74.99,
    isFeatured: false,
    isPublished: true,
    modules: [
      {
        title: "AWS Fundamentals",
        order: 1,
        lessons: [
          { title: "Introduction to AWS", type: "video" as const, duration: 12, isFree: true, order: 1 },
          { title: "AWS Global Infrastructure", type: "video" as const, duration: 18, isFree: false, order: 2 },
          { title: "IAM Deep Dive", type: "video" as const, duration: 30, isFree: false, order: 3 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Design resilient AWS architectures",
      "Implement security best practices",
      "Optimize costs on AWS",
      "Pass the AWS certification exam",
    ],
    requirements: [
      "Basic IT knowledge",
      "AWS Free Tier account",
      "Familiarity with networking concepts",
    ],
    rating: 4.6,
    reviewCount: 234,
    enrolledCount: 987,
  },
  {
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    description: `Learn UI/UX design from scratch and build a portfolio that gets you hired.

Master Figma, design principles, user research, wireframing, prototyping, and design systems.`,
    shortDescription: "Master UI/UX design with Figma. Learn design principles and build a professional portfolio.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    category: "Design",
    level: "beginner" as const,
    price: 79.99,
    discountPrice: 39.99,
    isFeatured: true,
    isPublished: true,
    modules: [
      {
        title: "Design Fundamentals",
        order: 1,
        lessons: [
          { title: "Introduction to UI/UX", type: "video" as const, duration: 10, isFree: true, order: 1 },
          { title: "Design Principles", type: "video" as const, duration: 25, isFree: true, order: 2 },
          { title: "Color Theory", type: "video" as const, duration: 20, isFree: false, order: 3 },
          { title: "Typography", type: "video" as const, duration: 18, isFree: false, order: 4 },
        ],
      },
      {
        title: "Figma Mastery",
        order: 2,
        lessons: [
          { title: "Getting Started with Figma", type: "video" as const, duration: 15, isFree: false, order: 1 },
          { title: "Components and Variants", type: "video" as const, duration: 30, isFree: false, order: 2 },
          { title: "Auto Layout", type: "video" as const, duration: 25, isFree: false, order: 3 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Master Figma from beginner to advanced",
      "Create beautiful UI designs",
      "Conduct user research",
      "Build a professional design portfolio",
    ],
    requirements: [
      "No prior design experience needed",
      "Figma account (free)",
      "Passion for design",
    ],
    rating: 4.8,
    reviewCount: 445,
    enrolledCount: 1890,
  },
  {
    title: "Node.js - The Complete Guide",
    slug: "nodejs-complete-guide",
    description: `Master Node.js, Express, and MongoDB to build scalable backend applications.

Learn RESTful API development, authentication, real-time applications with Socket.io, and deployment.`,
    shortDescription: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
    category: "Web Development",
    level: "intermediate" as const,
    price: 94.99,
    discountPrice: 47.99,
    isFeatured: false,
    isPublished: true,
    modules: [
      {
        title: "Node.js Basics",
        order: 1,
        lessons: [
          { title: "What is Node.js?", type: "video" as const, duration: 10, isFree: true, order: 1 },
          { title: "Node.js Modules", type: "video" as const, duration: 20, isFree: false, order: 2 },
          { title: "File System", type: "video" as const, duration: 18, isFree: false, order: 3 },
        ],
      },
      {
        title: "Express.js",
        order: 2,
        lessons: [
          { title: "Introduction to Express", type: "video" as const, duration: 15, isFree: false, order: 1 },
          { title: "Routing", type: "video" as const, duration: 22, isFree: false, order: 2 },
          { title: "Middleware", type: "video" as const, duration: 25, isFree: false, order: 3 },
        ],
      },
    ],
    whatYouWillLearn: [
      "Build RESTful APIs",
      "Authentication and authorization",
      "Database integration with MongoDB",
      "Real-time apps with Socket.io",
    ],
    requirements: [
      "JavaScript knowledge",
      "Basic HTML/CSS",
      "Command line familiarity",
    ],
    rating: 4.7,
    reviewCount: 312,
    enrolledCount: 1456,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Create an instructor user
    let instructor = await User.findOne({ email: "instructor@coursemaster.com" });
    if (!instructor) {
      instructor = await User.create({
        name: "John Instructor",
        email: "instructor@coursemaster.com",
        password: "password123",
        role: "instructor",
      });
      console.log("Created instructor user");
    }

    // Create an admin user
    let admin = await User.findOne({ email: "admin@coursemaster.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@coursemaster.com",
        password: "password123",
        role: "admin",
      });
      console.log("Created admin user");
    }

    // Create sample courses
    for (const courseData of sampleCourses) {
      const existingCourse = await Course.findOne({ slug: courseData.slug });
      if (!existingCourse) {
        await Course.create({
          ...courseData,
          instructor: instructor._id,
          instructorName: instructor.name,
        });
        console.log(`Created course: ${courseData.title}`);
      }
    }

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
