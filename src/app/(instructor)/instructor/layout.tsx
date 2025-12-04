import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { InstructorLayout } from "@/components/dashboard/InstructorLayout";

export default async function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/instructor");
  }

  if (user.role !== "instructor" && user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <InstructorLayout
      user={{
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }}
    >
      {children}
    </InstructorLayout>
  );
}
