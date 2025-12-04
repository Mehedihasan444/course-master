import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      _id: id,
      student: user._id,
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Check if lesson is already completed
    const lessonIdStr = lessonId.toString();
    const alreadyCompleted = enrollment.completedLessonIds.some(
      (id: { toString: () => string }) => id.toString() === lessonIdStr
    );

    if (alreadyCompleted) {
      return NextResponse.json({
        success: true,
        message: "Lesson already completed",
        enrollment,
      });
    }

    // Get course to calculate total lessons
    const course = await Course.findById(enrollment.course);
    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Add lesson to completed list
    enrollment.completedLessonIds.push(lessonId);
    enrollment.completedLessons = enrollment.completedLessonIds.length;
    enrollment.totalLessons = course.totalLessons;

    // Calculate progress
    enrollment.overallProgress = Math.round(
      (enrollment.completedLessons / enrollment.totalLessons) * 100
    );

    // Check if course is completed
    if (enrollment.overallProgress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();

    await enrollment.save();

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
      enrollment: {
        completedLessons: enrollment.completedLessons,
        totalLessons: enrollment.totalLessons,
        overallProgress: enrollment.overallProgress,
        isCompleted: enrollment.isCompleted,
      },
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const enrollment = await Enrollment.findOne({
      _id: id,
      student: user._id,
    }).populate({
      path: "course",
      select: "title slug totalLessons",
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollment,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
