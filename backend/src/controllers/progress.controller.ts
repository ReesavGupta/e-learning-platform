import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Progress } from '../models/progress.model'
import { Course } from '../models/course.model'
import asyncHandler from '../utils/asyncHandler'

class ProgressController {
  public getProgress = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { studentId, courseId } = req.params

      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: 'Invalid student ID' })
        return
      }

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: 'Invalid course ID' })
        return
      }

      const progress = await Progress.findOne({
        student: studentId,
        course: courseId,
      }).populate('lessons.lessonId', 'title')

      if (!progress) {
        res.json({ data: [], message: 'Progress not found' })
        return
      }

      // Calculate overall progress percentage
      const totalLessons = progress.lessons.length
      const completedLessonsCount = progress.lessons.filter(
        (lesson: any) => lesson.completed
      ).length
      const overallProgress = (completedLessonsCount / totalLessons) * 100

      res.status(200).json({
        message: 'Progress found',
        data: {
          course: progress.course,
          overallProgress,
          lessons: progress.lessons,
        },
      })
    }
  )

  public updateProgress = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { studentId, courseId } = req.params

      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: 'Invalid student ID' })
        return
      }

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: 'Invalid course ID' })
        return
      }

      let progress = await Progress.findOne({
        student: studentId,
        course: courseId,
      })

      if (!progress) {
        const course = await Course.findById(courseId).populate('lessons')
        if (!course) {
          res.status(404).json({ message: 'Course not found' })
          return
        }

        progress = await Progress.create({
          student: studentId,
          course: courseId,
          lessons: course.lessons.map((lesson: any) => ({
            lessonId: lesson._id,
            completed: false,
          })),
        })
      }

      await progress.updateProgress()

      // Calculate overall progress percentage
      const totalLessons = progress.lessons.length
      const completedLessonsCount = progress.lessons.filter(
        (lesson: any) => lesson.completed
      ).length
      const overallProgress = (completedLessonsCount / totalLessons) * 100

      res.status(200).json({
        message: 'Progress updated',
        data: {
          course: progress.course,
          overallProgress,
          lessons: progress.lessons,
        },
      })
    }
  )

  public completeLesson = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { studentId, courseId, lessonId } = req.params

      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: 'Invalid student ID' })
        return
      }

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: 'Invalid course ID' })
        return
      }

      if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
        res.status(400).json({ message: 'Invalid lesson ID' })
        return
      }

      let progress = await Progress.findOne({
        student: studentId,
        course: courseId,
      })

      if (!progress) {
        const course = await Course.findById(courseId).populate('lessons')
        if (!course) {
          res.status(404).json({ message: 'Course not found' })
          return
        }

        progress = await Progress.create({
          student: studentId,
          course: courseId,
          lessons: course.lessons.map((lesson: any) => ({
            lessonId: lesson._id,
            completed: false,
          })),
        })
      }

      await progress.completeLesson(lessonId)
      // await progress.updateProgress()
      res.status(200).json({ message: 'Lesson completed', data: progress })
    }
  )

  public getCourseProgress = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { courseId } = req.params

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: 'Invalid course ID' })
        return
      }

      const progress = await Progress.find({ course: courseId }).populate(
        'student',
        'username email'
      )

      if (!progress || progress.length === 0) {
        res.status(404).json({ message: 'No progress found for this course' })
        return
      }

      res.status(200).json({ message: 'Progress for course', data: progress })
    }
  )
}

export const progressController = new ProgressController()
