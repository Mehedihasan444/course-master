import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuizAttempt } from "@/models/Submission";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";

const quizSubmitSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.number().min(0),
    })
  ),
  startedAt: z.string().datetime(),
});

// POST - Submit quiz answers
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Validate input
    const validationResult = quizSubmitSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { courseId, quizId, moduleId, answers, startedAt } = validationResult.data;

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      student: auth.userId,
      course: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Get course and quiz
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const quiz = course.quizzes.find((q) => q._id.toString() === quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) {
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: false,
          points: 0,
        };
      }

      maxScore += question.points;
      const isCorrect = question.correctAnswer === answer.selectedOption;
      const points = isCorrect ? question.points : 0;
      score += points;

      return {
        questionId: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        points,
      };
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    // Calculate time spent
    const startTime = new Date(startedAt);
    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      student: auth.userId,
      course: courseId,
      quizId,
      moduleId,
      answers: gradedAnswers,
      score,
      maxScore,
      percentage,
      passed,
      startedAt: startTime,
      completedAt: endTime,
      timeSpent,
    });

    return NextResponse.json({
      success: true,
      message: passed ? "Congratulations! You passed the quiz!" : "Quiz completed. Keep practicing!",
      result: {
        score,
        maxScore,
        percentage,
        passed,
        passingScore: quiz.passingScore,
        timeSpent,
        answers: gradedAnswers,
      },
      attemptId: attempt._id,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}

// GET - Get student's quiz attempts
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const quizId = searchParams.get("quizId");

    const query: Record<string, unknown> = { student: auth.userId };
    if (courseId) query.course = courseId;
    if (quizId) query.quizId = quizId;

    const attempts = await QuizAttempt.find(query)
      .populate("course", "title slug")
      .sort({ completedAt: -1 });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Get quiz attempts error:", error);
    return NextResponse.json(
      { error: "Failed to get quiz attempts" },
      { status: 500 }
    );
  }
}
