import mongoose from 'mongoose'
import { Course } from './course.model'

interface progressDocument extends mongoose.Document {
  student: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  completedLessons: number
  progressPercentage: number
  lessons: [
    {
      lessonId: mongoose.Types.ObjectId
      completed: boolean
    }
  ]
  updateProgress: () => Promise<void>
  completeLesson: (lessonId: string) => Promise<void>
}

const ProgressSchema: mongoose.Schema<progressDocument> = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },

    lessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

ProgressSchema.methods.updateProgress = async function () {
  const course = await Course.findById(this.course).populate('lessons')
  if (!course) {
    return
  }
  const totalLessons = course.lessons.length

  // Count how many lessons are completed
  const completedLessonsCount = this.lessons.filter(
    (lesson: any) => lesson.completed
  ).length

  this.completedLessons = completedLessonsCount

  this.progressPercentage = (this.completedLessons / totalLessons) * 100

  await this.save()
}

ProgressSchema.methods.completeLesson = async function (lessonId: string) {
  const lesson = this.lessons.find(
    (lesson: any) => lesson.lessonId.toString() === lessonId
  )

  if (lesson && !lesson.completed) {
    lesson.completed = true

    await this.updateProgress()
  }
}

export const Progress = mongoose.model('Progress', ProgressSchema)
