import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { getCurrentUser } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ slug: string }>;
}

// GET - Get single course by slug
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    const course = await Course.findOne({ slug, isPublished: true })
      .populate("instructor", "name email avatar bio")
      .lean();
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT - Update course (Admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { slug } = await params;
    const body = await req.json();
    
    // Partial validation for update
    const validationResult = courseSchema.partial().safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }
    
    const course = await Course.findOneAndUpdate(
      { slug },
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE - Delete course (Admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { slug } = await params;
    
    const course = await Course.findOneAndDelete({ slug });
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
