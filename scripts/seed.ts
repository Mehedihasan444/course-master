import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "../src/lib/db";
import User from "../src/models/User";
import Course from "../src/models/Course";
import Enrollment from "../src/models/Enrollment";

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("Cleared existing data");

    // Create users - password will be hashed by the User model's pre-save hook
    const password = "Password123";

    const admin = await User.create({
      name: "Admin User",
      email: "admin@coursemaster.com",
      password: password,
      role: "admin",
    });
    console.log("Created admin user");

    const student1 = await User.create({
      name: "Mike Wilson",
      email: "mike@example.com",
      password: password,
      role: "student",
    });

    const student2 = await User.create({
      name: "Emily Brown",
      email: "emily@example.com",
      password: password,
      role: "student",
    });
    console.log("Created student users");

    // Create courses (admin creates courses, instructorName is just display text)
    const courseData = [
      {
        title: "Complete Web Development Bootcamp",
        slug: "complete-web-development-bootcamp",
        description:
          "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners who want to become full-stack developers.",
        shortDescription:
          "Master web development with this comprehensive bootcamp covering frontend and backend technologies.",
        instructor: admin._id,
        instructorName: "John Smith",
        price: 99.99,
        discountPrice: 49.99,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        category: "Web Development",
        level: "Beginner",
        language: "English",
        requirements: [
          "Basic computer skills",
          "No programming experience needed",
          "A computer with internet access",
        ],
        whatYouWillLearn: [
          "Build responsive websites with HTML and CSS",
          "Master JavaScript fundamentals and ES6+",
          "Create dynamic web apps with React",
          "Build REST APIs with Node.js and Express",
          "Work with databases like MongoDB",
        ],
        tags: ["web development", "html", "css", "javascript", "react", "nodejs"],
        modules: [
          {
            title: "Getting Started with HTML",
            description: "Learn the fundamentals of HTML",
            order: 1,
            lessons: [
              {
                title: "Introduction to HTML",
                description: "Learn what HTML is and how it works",
                videoUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
                duration: 15,
                order: 1,
                isFree: true,
              },
              {
                title: "HTML Elements and Tags",
                description: "Understanding HTML elements and their usage",
                videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
                duration: 20,
                order: 2,
                isFree: true,
              },
              {
                title: "Forms and Inputs",
                description: "Creating interactive forms in HTML",
                videoUrl: "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
                duration: 25,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "CSS Fundamentals",
            description: "Style your web pages with CSS",
            order: 2,
            lessons: [
              {
                title: "Introduction to CSS",
                description: "Learn CSS basics and selectors",
                videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
                duration: 18,
                order: 1,
                isFree: false,
              },
              {
                title: "CSS Box Model",
                description: "Understanding margins, padding, and borders",
                videoUrl: "https://www.youtube.com/watch?v=1PnVor36_40",
                duration: 22,
                order: 2,
                isFree: false,
              },
              {
                title: "Flexbox and Grid",
                description: "Modern CSS layout techniques",
                videoUrl: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
                duration: 30,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "JavaScript Essentials",
            description: "Master JavaScript programming",
            order: 3,
            lessons: [
              {
                title: "JavaScript Basics",
                description: "Variables, data types, and operators",
                videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                duration: 25,
                order: 1,
                isFree: false,
              },
              {
                title: "Functions and Scope",
                description: "Understanding functions and variable scope",
                videoUrl: "https://www.youtube.com/watch?v=xUI5Tsl2JpY",
                duration: 28,
                order: 2,
                isFree: false,
              },
              {
                title: "DOM Manipulation",
                description: "Interacting with web pages using JavaScript",
                videoUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8",
                duration: 35,
                order: 3,
                isFree: false,
              },
            ],
          },
        ],
        assignments: [
          {
            title: "Build a Personal Portfolio Page",
            description: "Create a responsive personal portfolio page using HTML and CSS. Include sections for About, Projects, and Contact. Make sure it looks good on both desktop and mobile devices.",
            maxScore: 100,
          },
          {
            title: "JavaScript Todo App",
            description: "Build a functional todo list application using vanilla JavaScript. Implement features like adding, deleting, and marking todos as complete. Store data in localStorage.",
            maxScore: 100,
          },
        ],
        quizzes: [
          {
            title: "HTML & CSS Fundamentals Quiz",
            questions: [
              {
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
                correctAnswer: 0,
                points: 10,
              },
              {
                question: "Which CSS property is used to change the text color?",
                options: ["font-color", "text-color", "color", "foreground-color"],
                correctAnswer: 2,
                points: 10,
              },
              {
                question: "What is the correct way to select an element with id 'header' in CSS?",
                options: [".header", "#header", "header", "*header"],
                correctAnswer: 1,
                points: 10,
              },
            ],
            passingScore: 70,
            timeLimit: 10,
          },
          {
            title: "JavaScript Basics Quiz",
            questions: [
              {
                question: "Which keyword is used to declare a variable in JavaScript?",
                options: ["var", "let", "const", "All of the above"],
                correctAnswer: 3,
                points: 10,
              },
              {
                question: "What is the output of: typeof null?",
                options: ["null", "undefined", "object", "number"],
                correctAnswer: 2,
                points: 10,
              },
              {
                question: "Which method adds an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: 0,
                points: 10,
              },
            ],
            passingScore: 70,
            timeLimit: 10,
          },
        ],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Python for Data Science",
        slug: "python-for-data-science",
        description:
          "Master Python programming for data analysis and machine learning. Learn pandas, numpy, matplotlib, and scikit-learn to analyze data and build predictive models.",
        shortDescription:
          "Learn Python for data analysis, visualization, and machine learning.",
        instructor: admin._id,
        instructorName: "Sarah Johnson",
        price: 129.99,
        discountPrice: 79.99,
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        category: "Data Science",
        level: "Intermediate",
        language: "English",
        requirements: [
          "Basic programming knowledge",
          "Understanding of basic math concepts",
          "Python installed on your computer",
        ],
        whatYouWillLearn: [
          "Python programming fundamentals",
          "Data manipulation with Pandas",
          "Data visualization with Matplotlib and Seaborn",
          "Machine learning with Scikit-learn",
          "Real-world data science projects",
        ],
        tags: ["python", "data science", "machine learning", "pandas", "numpy"],
        modules: [
          {
            title: "Python Fundamentals",
            description: "Core Python programming concepts",
            order: 1,
            lessons: [
              {
                title: "Python Setup and Basics",
                description: "Setting up your Python environment",
                videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
                duration: 20,
                order: 1,
                isFree: true,
              },
              {
                title: "Data Types and Structures",
                description: "Lists, dictionaries, tuples, and sets",
                videoUrl: "https://www.youtube.com/watch?v=gOMW_n2-2Mw",
                duration: 30,
                order: 2,
                isFree: true,
              },
              {
                title: "Functions and Modules",
                description: "Creating reusable code",
                videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
                duration: 25,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "Data Analysis with Pandas",
            description: "Working with structured data",
            order: 2,
            lessons: [
              {
                title: "Introduction to Pandas",
                description: "DataFrames and Series",
                videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
                duration: 35,
                order: 1,
                isFree: false,
              },
              {
                title: "Data Cleaning",
                description: "Handling missing data and outliers",
                videoUrl: "https://www.youtube.com/watch?v=ZOX18HfLHGQ",
                duration: 40,
                order: 2,
                isFree: false,
              },
              {
                title: "Data Aggregation",
                description: "Grouping and summarizing data",
                videoUrl: "https://www.youtube.com/watch?v=txMdrV1kYvQ",
                duration: 30,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "Machine Learning Basics",
            description: "Introduction to ML algorithms",
            order: 3,
            lessons: [
              {
                title: "What is Machine Learning?",
                description: "Overview of ML concepts",
                videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
                duration: 25,
                order: 1,
                isFree: false,
              },
              {
                title: "Supervised Learning",
                description: "Classification and regression",
                videoUrl: "https://www.youtube.com/watch?v=4qVRBYAdLAo",
                duration: 45,
                order: 2,
                isFree: false,
              },
              {
                title: "Model Evaluation",
                description: "Metrics and validation techniques",
                videoUrl: "https://www.youtube.com/watch?v=85dtiMz9tSo",
                duration: 35,
                order: 3,
                isFree: false,
              },
            ],
          },
        ],
        assignments: [
          {
            title: "Data Analysis with Pandas",
            description: "Analyze a provided CSV dataset using Pandas. Calculate statistics, handle missing values, and create visualizations. Submit your Jupyter notebook or Python script.",
            maxScore: 100,
          },
          {
            title: "Build a Simple ML Model",
            description: "Train a classification model on the Iris dataset using scikit-learn. Evaluate its performance and explain your approach.",
            maxScore: 100,
          },
        ],
        quizzes: [
          {
            title: "Python Fundamentals Quiz",
            questions: [
              {
                question: "What is the output of: print(type([]))?",
                options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'set'>"],
                correctAnswer: 1,
                points: 10,
              },
              {
                question: "Which method is used to add an item to a list?",
                options: ["add()", "append()", "insert()", "push()"],
                correctAnswer: 1,
                points: 10,
              },
            ],
            passingScore: 70,
            timeLimit: 10,
          },
        ],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Advanced React Patterns",
        slug: "advanced-react-patterns",
        description:
          "Take your React skills to the next level. Learn advanced patterns, hooks, performance optimization, and state management techniques used by senior developers.",
        shortDescription:
          "Master advanced React patterns and best practices for building scalable applications.",
        instructor: admin._id,
        instructorName: "John Smith",
        price: 149.99,
        discountPrice: 99.99,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        category: "Web Development",
        level: "Advanced",
        language: "English",
        requirements: [
          "Strong JavaScript knowledge",
          "Experience with React basics",
          "Understanding of ES6+ features",
        ],
        whatYouWillLearn: [
          "Advanced React hooks patterns",
          "Component composition techniques",
          "Performance optimization strategies",
          "State management with Redux and Context",
          "Testing React applications",
        ],
        tags: ["react", "javascript", "frontend", "advanced", "hooks"],
        modules: [
          {
            title: "Advanced Hooks",
            description: "Master React hooks patterns",
            order: 1,
            lessons: [
              {
                title: "Custom Hooks",
                description: "Building reusable custom hooks",
                videoUrl: "https://www.youtube.com/watch?v=J-g9ZJha8FE",
                duration: 30,
                order: 1,
                isFree: true,
              },
              {
                title: "useReducer Patterns",
                description: "Complex state management with useReducer",
                videoUrl: "https://www.youtube.com/watch?v=kK_Wqx3RnHk",
                duration: 35,
                order: 2,
                isFree: false,
              },
              {
                title: "useCallback and useMemo",
                description: "Performance optimization hooks",
                videoUrl: "https://www.youtube.com/watch?v=uojLJFt9SzY",
                duration: 28,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "Component Patterns",
            description: "Advanced component architecture",
            order: 2,
            lessons: [
              {
                title: "Compound Components",
                description: "Building flexible component APIs",
                videoUrl: "https://www.youtube.com/watch?v=vPRdY87_SH0",
                duration: 40,
                order: 1,
                isFree: false,
              },
              {
                title: "Render Props",
                description: "Sharing code between components",
                videoUrl: "https://www.youtube.com/watch?v=NdapMDgNhtE",
                duration: 35,
                order: 2,
                isFree: false,
              },
              {
                title: "Higher-Order Components",
                description: "HOC patterns and use cases",
                videoUrl: "https://www.youtube.com/watch?v=B6aNv8nkUSw",
                duration: 32,
                order: 3,
                isFree: false,
              },
            ],
          },
        ],
        isPublished: true,
        isFeatured: false,
      },
      {
        title: "UI/UX Design Fundamentals",
        slug: "ui-ux-design-fundamentals",
        description:
          "Learn the principles of user interface and user experience design. Create beautiful, user-friendly designs using modern tools and methodologies.",
        shortDescription:
          "Master UI/UX design principles and create stunning user interfaces.",
        instructor: admin._id,
        instructorName: "Sarah Johnson",
        price: 89.99,
        discountPrice: null,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        category: "Design",
        level: "Beginner",
        language: "English",
        requirements: [
          "No prior design experience needed",
          "Basic computer skills",
          "Creative mindset",
        ],
        whatYouWillLearn: [
          "Design principles and theory",
          "Color theory and typography",
          "Wireframing and prototyping",
          "User research methods",
          "Design tools like Figma",
        ],
        tags: ["design", "ui", "ux", "figma", "user experience"],
        modules: [
          {
            title: "Design Fundamentals",
            description: "Core design principles",
            order: 1,
            lessons: [
              {
                title: "What is UI/UX Design?",
                description: "Introduction to design disciplines",
                videoUrl: "https://example.com/design1",
                duration: 15,
                order: 1,
                isFree: true,
              },
              {
                title: "Design Principles",
                description: "Balance, contrast, hierarchy, and more",
                videoUrl: "https://example.com/design2",
                duration: 25,
                order: 2,
                isFree: true,
              },
              {
                title: "Color Theory",
                description: "Using colors effectively in design",
                videoUrl: "https://example.com/design3",
                duration: 30,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "User Experience",
            description: "Creating user-centered designs",
            order: 2,
            lessons: [
              {
                title: "User Research",
                description: "Understanding your users",
                videoUrl: "https://example.com/design4",
                duration: 35,
                order: 1,
                isFree: false,
              },
              {
                title: "User Personas",
                description: "Creating and using personas",
                videoUrl: "https://example.com/design5",
                duration: 25,
                order: 2,
                isFree: false,
              },
              {
                title: "User Journey Mapping",
                description: "Mapping the user experience",
                videoUrl: "https://example.com/design6",
                duration: 30,
                order: 3,
                isFree: false,
              },
            ],
          },
        ],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Mobile App Development with React Native",
        slug: "mobile-app-development-react-native",
        description:
          "Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, native modules, and app deployment.",
        shortDescription:
          "Create professional mobile apps for iOS and Android with React Native.",
        instructor: admin._id,
        instructorName: "John Smith",
        price: 119.99,
        discountPrice: 69.99,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        category: "Mobile Development",
        level: "Intermediate",
        language: "English",
        requirements: [
          "JavaScript proficiency",
          "React experience recommended",
          "Mac for iOS development (optional)",
        ],
        whatYouWillLearn: [
          "React Native fundamentals",
          "Navigation and routing",
          "State management in mobile apps",
          "Native modules and APIs",
          "App store deployment",
        ],
        tags: ["react native", "mobile", "ios", "android", "javascript"],
        modules: [
          {
            title: "React Native Basics",
            description: "Getting started with React Native",
            order: 1,
            lessons: [
              {
                title: "Setting Up Your Environment",
                description: "Installing React Native CLI and dependencies",
                videoUrl: "https://example.com/rn1",
                duration: 25,
                order: 1,
                isFree: true,
              },
              {
                title: "Core Components",
                description: "View, Text, Image, and more",
                videoUrl: "https://example.com/rn2",
                duration: 30,
                order: 2,
                isFree: true,
              },
              {
                title: "Styling in React Native",
                description: "Flexbox and StyleSheet",
                videoUrl: "https://example.com/rn3",
                duration: 28,
                order: 3,
                isFree: false,
              },
            ],
          },
          {
            title: "Navigation",
            description: "Building app navigation",
            order: 2,
            lessons: [
              {
                title: "React Navigation Setup",
                description: "Installing and configuring navigation",
                videoUrl: "https://example.com/rn4",
                duration: 20,
                order: 1,
                isFree: false,
              },
              {
                title: "Stack Navigator",
                description: "Screen-to-screen navigation",
                videoUrl: "https://example.com/rn5",
                duration: 25,
                order: 2,
                isFree: false,
              },
              {
                title: "Tab and Drawer Navigation",
                description: "Complex navigation patterns",
                videoUrl: "https://example.com/rn6",
                duration: 35,
                order: 3,
                isFree: false,
              },
            ],
          },
        ],
        isPublished: true,
        isFeatured: false,
      },
    ];
    
    const courses = [];
    for (const data of courseData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const course = await Course.create(data as any);
      courses.push(Array.isArray(course) ? course[0] : course);
    }
    console.log(`Created ${courses.length} courses`);

    // Create enrollments with proper structure
    const course0Modules = courses[0].modules;
    const course1Modules = courses[1].modules;

    await Enrollment.create([
      {
        student: student1._id,
        course: courses[0]._id,
        progress: [
          {
            moduleId: course0Modules[0]._id,
            lessons: [
              { lessonId: course0Modules[0].lessons[0]._id, completed: true, watchedDuration: 15 },
              { lessonId: course0Modules[0].lessons[1]._id, completed: true, watchedDuration: 20 },
              { lessonId: course0Modules[0].lessons[2]._id, completed: false, watchedDuration: 5 },
            ],
            completed: false,
          },
        ],
        overallProgress: 22,
        completedLessons: 2,
        totalLessons: 9,
        isCompleted: false,
      },
      {
        student: student1._id,
        course: courses[1]._id,
        progress: [
          {
            moduleId: course1Modules[0]._id,
            lessons: [
              { lessonId: course1Modules[0].lessons[0]._id, completed: true, watchedDuration: 20 },
              { lessonId: course1Modules[0].lessons[1]._id, completed: false, watchedDuration: 10 },
            ],
            completed: false,
          },
        ],
        overallProgress: 11,
        completedLessons: 1,
        totalLessons: 9,
        isCompleted: false,
      },
      {
        student: student2._id,
        course: courses[0]._id,
        progress: course0Modules.map((module) => ({
          moduleId: module._id,
          lessons: module.lessons.map((lesson) => ({
            lessonId: lesson._id,
            completed: true,
            watchedDuration: lesson.duration,
            completedAt: new Date(),
          })),
          completed: true,
        })),
        overallProgress: 100,
        completedLessons: 9,
        totalLessons: 9,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        student: student2._id,
        course: courses[2]._id,
        progress: [],
        overallProgress: 0,
        completedLessons: 0,
        totalLessons: 6,
        isCompleted: false,
      },
    ]);
    console.log("Created enrollments");

    // Update course enrollment counts
    await Course.findByIdAndUpdate(courses[0]._id, { enrollmentCount: 2 });
    await Course.findByIdAndUpdate(courses[1]._id, { enrollmentCount: 1 });
    await Course.findByIdAndUpdate(courses[2]._id, { enrollmentCount: 1 });
    console.log("Updated enrollment counts");

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📧 Test Accounts:");
    console.log("─".repeat(50));
    console.log("Admin:   admin@coursemaster.com / Password123");
    console.log("Student: mike@example.com / Password123");
    console.log("Student: emily@example.com / Password123");
    console.log("─".repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
