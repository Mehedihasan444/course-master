import Link from "next/link";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  Plus,
  ArrowRight,
} from "lucide-react";

async function getInstructorStats(userId: string) {
  await connectDB();

  // Get all courses by this instructor
  const courses = await Course.find({ instructor: userId }).lean();
  const courseIds = courses.map((c) => c._id);

  // Get enrollments for these courses
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  }).lean();

  // Calculate stats
  const totalStudents = new Set(
    enrollments.map((e) => e.student.toString())
  ).size;
  const totalRevenue = enrollments.reduce((acc, e) => acc + (e.amountPaid || 0), 0);
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const totalViews = courses.reduce((acc, c) => acc + (c.views || 0), 0);

  // Calculate average rating
  const allRatings = courses.flatMap((c) => c.reviews?.map((r: { rating: number }) => r.rating) || []);
  const avgRating =
    allRatings.length > 0
      ? allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length
      : 0;

  // Recent enrollments
  const recentEnrollments = await Enrollment.find({
    course: { $in: courseIds },
  })
    .sort({ enrolledAt: -1 })
    .limit(5)
    .populate("student", "name email avatar")
    .populate("course", "title slug")
    .lean();

  return {
    stats: {
      totalCourses: courses.length,
      publishedCourses,
      totalStudents,
      totalRevenue,
      totalViews,
      avgRating: avgRating.toFixed(1),
    },
    courses: JSON.parse(JSON.stringify(courses.slice(0, 4))),
    recentEnrollments: JSON.parse(JSON.stringify(recentEnrollments)),
  };
}

export default async function InstructorDashboardPage() {
  const user = await getCurrentUser();
  const { stats, courses, recentEnrollments } = await getInstructorStats(
    user!._id.toString()
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">
            Welcome back, {user!.name.split(" ")[0]}!
          </h1>
          <p className="text-surface-500 mt-1">
            Here's what's happening with your courses
          </p>
        </div>
        <Link href="/instructor/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.totalCourses}
                </p>
                <p className="text-sm text-surface-500">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.totalStudents}
                </p>
                <p className="text-sm text-surface-500">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-surface-500">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {stats.avgRating}
                </p>
                <p className="text-sm text-surface-500">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-surface-900">
              My Courses
            </h2>
            <Link
              href="/instructor/courses"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(
                (course: {
                  _id: string;
                  slug: string;
                  title: string;
                  thumbnail?: string;
                  isPublished: boolean;
                  price: number;
                  enrollmentCount: number;
                  averageRating: number;
                }) => (
                  <Link
                    key={course._id}
                    href={`/instructor/courses/${course.slug}`}
                  >
                    <Card hover className="h-full">
                      <div className="relative aspect-video bg-surface-100">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-primary-400" />
                          </div>
                        )}
                        <Badge
                          variant={course.isPublished ? "success" : "secondary"}
                          className="absolute top-2 right-2"
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-surface-900 line-clamp-1 mb-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-surface-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.enrollmentCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span>{course.averageRating?.toFixed(1) || "N/A"}</span>
                          </div>
                          <span className="font-semibold text-surface-900">
                            ${course.price}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <BookOpen className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                No courses yet
              </h3>
              <p className="text-surface-500 mb-4">
                Create your first course and start teaching
              </p>
              <Link href="/instructor/courses/new">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Create Course
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Enrollments */}
        <div>
          <h2 className="text-xl font-semibold text-surface-900 mb-4">
            Recent Enrollments
          </h2>
          <Card>
            <CardContent className="py-4">
              {recentEnrollments.length > 0 ? (
                <ul className="divide-y divide-surface-100">
                  {recentEnrollments.map(
                    (enrollment: {
                      _id: string;
                      student: { name: string; avatar?: string };
                      course: { title: string; slug: string };
                      enrolledAt: string;
                      amountPaid: number;
                    }) => (
                      <li
                        key={enrollment._id}
                        className="py-3 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                          {enrollment.student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-surface-900 truncate">
                            {enrollment.student.name}
                          </p>
                          <p className="text-sm text-surface-500 truncate">
                            {enrollment.course.title}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-accent-600">
                          +${enrollment.amountPaid || 0}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-surface-300 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">No enrollments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
