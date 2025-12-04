
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  Card,
  CardContent,
  Badge,
  Input,
  Select,
} from "@/components/ui";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  Mail,
  Calendar,
} from "lucide-react";

interface SearchParams {
  role?: string;
  search?: string;
  page?: string;
}

async function getUsers(searchParams: SearchParams) {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (searchParams.role && searchParams.role !== "all") {
    query.role = searchParams.role;
  }

  let users = await User.find(query)
    .sort({ createdAt: -1 })
    .select("name email role avatar createdAt")
    .lean();

  // Filter by search
  if (searchParams.search) {
    const searchLower = searchParams.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    );
  }

  // Stats
  const totalUsers = await User.countDocuments();
  const students = await User.countDocuments({ role: "student" });
  const instructors = await User.countDocuments({ role: "instructor" });
  const admins = await User.countDocuments({ role: "admin" });

  return {
    users: JSON.parse(JSON.stringify(users)),
    stats: { totalUsers, students, instructors, admins },
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { users, stats } = await getUsers(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Users</h1>
        <p className="text-surface-500 mt-1">Manage platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-surface-900">
              {stats.totalUsers}
            </p>
            <p className="text-sm text-surface-500">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-primary-600">
              {stats.students}
            </p>
            <p className="text-sm text-surface-500">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-accent-600">
              {stats.instructors}
            </p>
            <p className="text-sm text-surface-500">Instructors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{stats.admins}</p>
            <p className="text-sm text-surface-500">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                name="search"
                placeholder="Search users..."
                defaultValue={params.search}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                name="role"
                defaultValue={params.role || "all"}
                options={[
                  { value: "all", label: "All Roles" },
                  { value: "student", label: "Students" },
                  { value: "instructor", label: "Instructors" },
                  { value: "admin", label: "Admins" },
                ]}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Filter
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      {users.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-surface-500">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-surface-500">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-surface-500">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-surface-500">
                    Joined
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-surface-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user: {
                    _id: string;
                    name: string;
                    email: string;
                    role: string;
                    avatar?: string;
                    createdAt: string;
                  }) => (
                    <tr
                      key={user._id}
                      className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <span className="font-medium text-surface-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-surface-600">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "instructor"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-surface-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-surface-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-16">
          <Users className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">
            No users found
          </h3>
          <p className="text-surface-500">
            Try adjusting your filters to find users
          </p>
        </Card>
      )}
    </div>
  );
}
