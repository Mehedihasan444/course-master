"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Select,
} from "@/components/ui";
import {
  BookOpen,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Code,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { COURSE_CATEGORIES, COURSE_LEVELS } from "@/lib/constants";

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  type: z.enum(["video", "article", "quiz"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean(),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
});

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  shortDescription: z.string().min(10, "Short description is required").max(200),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be 0 or more"),
  thumbnail: z.string().optional(),
  previewVideo: z.string().optional(),
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      category: "",
      level: "beginner",
      price: 0,
      thumbnail: "",
      previewVideo: "",
      modules: [
        {
          title: "Getting Started",
          lessons: [
            {
              title: "Introduction",
              type: "video",
              duration: 5,
              content: "",
              videoUrl: "",
              isFree: true,
            },
          ],
        },
      ],
      requirements: [""],
      whatYouWillLearn: [""],
    },
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Course created successfully!");
        router.push("/instructor/courses");
      } else {
        toast.error(result.error || "Failed to create course");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/instructor/courses"
          className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Create New Course
          </h1>
          <p className="text-surface-500">
            Fill in the details to create your course
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Course Title *
              </label>
              <Input
                {...register("title")}
                placeholder="e.g., Complete Web Development Bootcamp"
                error={errors.title?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Short Description *
              </label>
              <Input
                {...register("shortDescription")}
                placeholder="A brief summary of your course (max 200 characters)"
                error={errors.shortDescription?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Full Description *
              </label>
              <Textarea
                {...register("description")}
                placeholder="Detailed description of what students will learn..."
                rows={5}
                error={errors.description?.message}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Category *
                </label>
                <Select {...register("category")} error={errors.category?.message}>
                  <option value="">Select category</option>
                  {COURSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Level *
                </label>
                <Select {...register("level")}>
                  {COURSE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  error={errors.price?.message}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Thumbnail URL
                </label>
                <Input
                  {...register("thumbnail")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Preview Video URL
                </label>
                <Input
                  {...register("previewVideo")}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules & Lessons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary-600" />
                Course Content
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  appendModule({
                    title: `Module ${moduleFields.length + 1}`,
                    lessons: [
                      {
                        title: "New Lesson",
                        type: "video",
                        duration: 5,
                        content: "",
                        videoUrl: "",
                        isFree: false,
                      },
                    ],
                  });
                  setExpandedModules([...expandedModules, moduleFields.length]);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {moduleFields.map((module, moduleIndex) => (
              <ModuleEditor
                key={module.id}
                moduleIndex={moduleIndex}
                register={register}
                control={control}
                errors={errors}
                isExpanded={expandedModules.includes(moduleIndex)}
                onToggle={() => toggleModule(moduleIndex)}
                onRemove={() => removeModule(moduleIndex)}
                canRemove={moduleFields.length > 1}
              />
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/instructor/courses">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ModuleEditor({
  moduleIndex,
  register,
  control,
  errors,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: {
  moduleIndex: number;
  register: ReturnType<typeof useForm<CourseFormData>>["register"];
  control: ReturnType<typeof useForm<CourseFormData>>["control"];
  errors: ReturnType<typeof useForm<CourseFormData>>["formState"]["errors"];
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`,
  });

  return (
    <div className="border border-surface-200 rounded-xl overflow-hidden">
      {/* Module Header */}
      <div
        className="flex items-center gap-3 p-4 bg-surface-50 cursor-pointer"
        onClick={onToggle}
      >
        <GripVertical className="w-5 h-5 text-surface-400" />
        <button type="button" className="text-surface-500">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1">
          <Input
            {...register(`modules.${moduleIndex}.title`)}
            placeholder="Module title"
            className="font-medium"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <span className="text-sm text-surface-500">
          {lessonFields.length} lessons
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lessons */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {lessonFields.map((lesson, lessonIndex) => (
            <div
              key={lesson.id}
              className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg"
            >
              <GripVertical className="w-4 h-4 text-surface-400 mt-2" />

              <div className="flex-1 grid md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Input
                    {...register(
                      `modules.${moduleIndex}.lessons.${lessonIndex}.title`
                    )}
                    placeholder="Lesson title"
                    size="sm"
                  />
                </div>

                <div>
                  <Select
                    {...register(
                      `modules.${moduleIndex}.lessons.${lessonIndex}.type`
                    )}
                  >
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="quiz">Quiz</option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    {...register(
                      `modules.${moduleIndex}.lessons.${lessonIndex}.duration`,
                      { valueAsNumber: true }
                    )}
                    placeholder="Min"
                    min="1"
                    size="sm"
                    className="w-20"
                  />
                  <span className="text-sm text-surface-500">min</span>

                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      {...register(
                        `modules.${moduleIndex}.lessons.${lessonIndex}.isFree`
                      )}
                      className="rounded border-surface-300"
                    />
                    Free
                  </label>
                </div>
              </div>

              {lessonFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLesson(lessonIndex)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              appendLesson({
                title: "",
                type: "video",
                duration: 5,
                content: "",
                videoUrl: "",
                isFree: false,
              })
            }
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Lesson
          </Button>
        </div>
      )}
    </div>
  );
}
