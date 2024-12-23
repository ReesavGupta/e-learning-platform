import { Request, RequestHandler, Response } from 'express'
import mongoose from 'mongoose'
import { Progress } from '../models/progress.model'

class ProgressController {
  public async getProgress(req: Request, res: Response): Promise<void> {
    try {
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
        res.status(404).json({ message: 'Progress not found' })
        return
      }

      res.status(200).json({ message: 'Progress found', data: progress })
      return
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }

  public async updateProgress(req: Request, res: Response): Promise<void> {
    try {
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
        progress = await Progress.create({
          student: studentId,
          course: courseId,
          lessons: [],
        })
      }

      await progress.updateProgress()
      res.status(200).json({ message: 'Progress updated', data: progress })
      return
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }
  public async completeLesson(req: Request, res: Response): Promise<void> {
    try {
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
        progress = await Progress.create({
          student: studentId,
          course: courseId,
          lessons: [],
        })
      }

      await progress.completeLesson(lessonId)

      res.status(200).json({ message: 'Lesson completed', data: progress })
      return
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }
  // Get progress for all students in a course
  public async getCourseProgress(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params

      if (!courseId) {
        res.status(400).json({ message: 'Course ID is required' })
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
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving course progress', error })
    }
  }
}

export const progressController = new ProgressController()
