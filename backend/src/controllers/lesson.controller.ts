import { Request, RequestHandler, Response } from 'express'
import { Lesson } from '../models/lesson.model'
import { Course } from '../models/course.model'
import mongoose from 'mongoose'

const createLesson: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { courseId, title, content, order } = req.body

    if (!courseId || !title) {
      res.status(400).json({ message: 'course and title are required' })
      return
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: 'Invalid course id' })
      return
    }

    const checkCourse = await Course.findById(courseId)

    if (!checkCourse) {
      res.status(404).json({ message: 'Course not found' })
      return
    }

    const newLesson = await Lesson.create({
      course: courseId,
      title,
      content,
      order,
    })

    if (!newLesson) {
      res.status(500).json({ message: 'Error creating lesson' })
      return
    }

    res.status(201).json({ message: 'Lesson created', data: newLesson })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson' })
    return
  }
}

const getLessonsByCourse: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: 'Invalid course id' })
      return
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 })

    if (!lessons) {
      res.status(404).json({ message: 'Lessons not found' })
      return
    }

    res.status(200).json({ message: 'Lessons found', data: lessons })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error getting lessons' })
    return
  }
}

const getLessonById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: 'Invalid lesson id' })
      return
    }

    const lesson = await Lesson.findById(lessonId).populate('course', 'title')

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }

    res.status(200).json({ message: 'Lesson found', data: lesson })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error getting lesson' })
    return
  }
}

const updateLesson: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params

    const { title, content, order } = req.body

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: 'Invalid lesson id' })
      return
    }

    if (!title) {
      res.status(400).json({ message: 'Title is required' })
      return
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { title, content, order },
      { new: true }
    )

    if (!updatedLesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }

    res.status(200).json({ message: 'Lesson updated', data: updatedLesson })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson' })
    return
  }
}

const deleteLesson: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: 'Invalid lesson id' })
      return
    }

    const deletedLesson = await Lesson.findByIdAndDelete(lessonId)

    if (!deletedLesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }

    res.status(200).json({ message: 'Lesson deleted', data: deletedLesson })
    return
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson' })
    return
  }
}

export {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
}
