"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, Button } from "@/components/ui";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface InstructorLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/instructor",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/instructor/analytics",
    icon: BarChart3,
  },
  {
    title: "Earnings",
    href: "/instructor/earnings",
    icon: DollarSign,
  },
  {
    title: "Reviews",
    href: "/instructor/reviews",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/instructor/settings",
    icon: Settings,
  },
];

export function InstructorLayout({ children, user }: InstructorLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-surface-200 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-surface-200">
          <Link href="/instructor" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-surface-900">
              Instructor
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-surface-500 hover:text-surface-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Course Button */}
        <div className="p-4">
          <Link href="/instructor/courses/new">
            <Button className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
              Create Course
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/instructor" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-surface-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 w-full px-4 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-surface-500 hover:text-surface-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-surface-900">
              {sidebarItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/instructor" && pathname.startsWith(item.href))
              )?.title || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-surface-500 hover:text-surface-700"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
