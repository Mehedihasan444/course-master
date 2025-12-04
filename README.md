# CourseMaster - Modern EdTech Platform

A full-stack educational technology platform built with Next.js 16, TypeScript, MongoDB, and Tailwind CSS. Features a professional UI/UX with support for students, instructors, and administrators.

![CourseMaster](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop)

## ✨ Features

### For Students
- 📚 Browse and search courses by category, level, and price
- 🎓 Enroll in courses and track progress
- 📊 Personal dashboard with learning analytics
- 🎬 Interactive lesson player with video, articles, and quizzes
- 🏆 Progress tracking and completion certificates

### For Instructors
- 📝 Create and manage courses with modules and lessons
- 👥 Track student enrollments and engagement
- 📈 View analytics and earnings
- ⭐ Manage course reviews

### For Administrators
- 🛡️ Full platform oversight and management
- 👤 User management (students, instructors)
- 📊 Platform-wide analytics
- 💰 Revenue tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with HTTP-only cookies
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom component library with CVA
- **Form Handling:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mehedihasan444/course-master.git
cd course-master
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_SECRET_KEY=your_admin_secret
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

After seeding, you can log in with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coursemaster.com | password123 |
| Instructor | instructor@coursemaster.com | password123 |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages (home, courses)
│   ├── (auth)/            # Authentication pages
│   ├── (student)/         # Student dashboard
│   ├── (instructor)/      # Instructor dashboard
│   ├── (admin)/           # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utilities and configurations
├── models/                # Mongoose models
└── store/                 # Redux store and slices
```

## 🎨 UI Components

The project includes a custom component library:

- **Button** - Multiple variants (default, outline, ghost, link)
- **Input** - With validation, icons, and password toggle
- **Card** - Glass and elevated variants
- **Badge** - Status indicators
- **Progress** - Progress bars
- **Avatar** - User avatars with fallback
- **Select/Textarea** - Form inputs
- **Skeleton** - Loading states

## 🔐 Authentication

- JWT-based authentication with HTTP-only cookies
- Middleware-protected routes
- Role-based access control (student, instructor, admin)
- Session persistence across page refreshes

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first approach
- Collapsible sidebar navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Video hosting integration
- [ ] Live classes with WebRTC
- [ ] Discussion forums
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Course recommendations
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Mehedi Hasan**
- GitHub: [@Mehedihasan444](https://github.com/Mehedihasan444)

---

Built with ❤️ using Next.js
