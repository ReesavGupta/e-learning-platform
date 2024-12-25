import mongoose from 'mongoose'
import { Course } from './course.model'
import { Lesson } from './lesson.model'

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
  const courseLessons = await Lesson.find({ course: this.course })
  if (!courseLessons) {
    return
  }

  const totalLessons = courseLessons.length
  courseLessons.forEach((eachCourseLesson: any) => {
    if (
      !this.lessons.some(
        (progressLesson: any) =>
          progressLesson.lessonId.toString() === eachCourseLesson._id.toString()
      )
    ) {
      this.lessons.push({ lessonId: eachCourseLesson._id, completed: false })
    }
  })
  console.log('this.lessons', this.lessons)
  // Count completed lessons
  const completedLessonsCount = this.lessons.filter(
    (lesson: any) => lesson.completed
  ).length

  this.completedLessons = completedLessonsCount
  this.progressPercentage = (completedLessonsCount / totalLessons) * 100

  await this.save()
}

ProgressSchema.methods.completeLesson = async function (lessonId: string) {
  let lesson = this.lessons.find(
    (lesson: any) => lesson.lessonId.toString() === lessonId
  )

  if (!lesson) {
    this.lessons.push({ lessonId, completed: true })
  } else if (!lesson.completed) {
    lesson.completed = true
  }

  await this.updateProgress()
}

export const Progress = mongoose.model('Progress', ProgressSchema)
