"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button } from "@/components/ui";
import {
  Play,
  Pause,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Code,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface Lesson {
  _id: string;
  title: string;
  type: "video" | "article" | "quiz";
  content: string;
  videoUrl?: string;
  duration: number;
}

interface LessonPlayerProps {
  lesson: Lesson;
  courseSlug: string;
  isCompleted: boolean;
  prevLesson: { _id: string; title: string } | null;
  nextLesson: { _id: string; title: string } | null;
  enrollmentId: string;
}

export default function LessonPlayer({
  lesson,
  courseSlug,
  isCompleted: initialCompleted,
  prevLesson,
  nextLesson,
  enrollmentId,
}: LessonPlayerProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const markAsCompleted = async () => {
    if (isCompleted) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId: lesson._id }),
      });

      if (response.ok) {
        setIsCompleted(true);
        // Auto-navigate to next lesson after a short delay
        if (nextLesson) {
          setTimeout(() => {
            router.push(`/dashboard/courses/${courseSlug}/lessons/${nextLesson._id}`);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
              {lesson.videoUrl ? (
                <video
                  src={lesson.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  onEnded={markAsCompleted}
                />
              ) : (
                <>
                  <div className="text-center text-white">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-lg opacity-75">Video content placeholder</p>
                    <p className="text-sm opacity-50 mt-2">
                      Duration: {lesson.duration} minutes
                    </p>
                  </div>

                  {/* Custom Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
                      <div className="h-full w-1/3 bg-primary-500 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-2 text-white hover:text-primary-400 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </button>
                        <button className="p-2 text-white hover:text-primary-400 transition-colors">
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-white hover:text-primary-400 transition-colors">
                          <SkipForward className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-2 text-white hover:text-primary-400 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-white text-sm">5:23 / {lesson.duration}:00</span>
                      </div>
                      <button className="p-2 text-white hover:text-primary-400 transition-colors">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case "article":
        return (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Article</span>
              </div>
              <div className="prose prose-lg max-w-none">
                {lesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                ) : (
                  <div className="text-center text-surface-500 py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Article content will appear here</p>
                    <p className="text-sm mt-2">
                      Estimated reading time: {lesson.duration} minutes
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "quiz":
        return (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <Code className="w-5 h-5" />
                <span className="text-sm font-medium">Quiz</span>
              </div>
              <div className="text-center text-surface-500 py-12">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Quiz content will appear here</p>
                <p className="text-sm mt-2">
                  Duration: {lesson.duration} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Content */}
      {renderContent()}

      {/* Lesson Info */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-surface-900 mb-2">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-surface-500">
                <span className="capitalize">{lesson.type}</span>
                <span>•</span>
                <span>{lesson.duration} min</span>
                {isCompleted && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-accent-600">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={markAsCompleted}
              disabled={isCompleted || isLoading}
              variant={isCompleted ? "outline" : "default"}
              leftIcon={
                isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )
              }
            >
              {isLoading
                ? "Saving..."
                : isCompleted
                ? "Completed"
                : "Mark as Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevLesson ? (
          <Link
            href={`/dashboard/courses/${courseSlug}/lessons/${prevLesson._id}`}
            className="flex items-center gap-2 px-4 py-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-surface-400">Previous</p>
              <p className="font-medium line-clamp-1">{prevLesson.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/dashboard/courses/${courseSlug}/lessons/${nextLesson._id}`}
            className="flex items-center gap-2 px-4 py-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <div className="text-right">
              <p className="text-xs text-surface-400">Next</p>
              <p className="font-medium line-clamp-1">{nextLesson.title}</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${courseSlug}`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Back to Course</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}
