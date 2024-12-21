import { Request, Response, RequestHandler } from 'express'
import { Course } from '../models/course.model'

const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, instructor } = req.body
    if (!title || !description || !instructor) {
      res.status(400).json({ message: 'Please fill in all fields' })
      return
    }
    const newCourse = await Course.create({ title, description, instructor })

    if (!newCourse) {
      res.status(400).json({ message: 'Course not created' })
      return
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
    return
  }
}
const deleteCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params._id
    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({ message: 'Course not found' })
      return
    }
    const deleteCourse = await Course.findByIdAndDelete(courseId)
    if (!deleteCourse) {
      res.status(400).json({ message: 'Course not deleted' })
      return
    }
    res.status(200).json({ message: 'Course deleted successfully' })
    return
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
    return
  }
}
const getAllCourses: RequestHandler = async (req: Request, res: Response) => {
  try {
    const allCourses = await Course.find()
    if (!allCourses) {
      res.status(404).json({ message: 'Courses not found' })
      return
    }
    res.status(200).json(allCourses)
    return
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
    return
  }
}
const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params._id
    if (!courseId) {
      res.status(400).json({ message: 'Please provide course id' })
      return
    }
    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({ message: 'Course not found' })
      return
    }
    res.status(200).json(course)
    return
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params._id
    const { title, description, instructor } = req.body
    if (!title || !description || !instructor) {
      res.status(400).json({ message: 'Please fill in all fields' })
      return
    }
    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({ message: 'Course not found' })
      return
    }
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {
      title,
      description,
      instructor,
    })
    if (!updatedCourse) {
      res.status(400).json({ message: 'Course not updated' })
      return
    }
    res.status(200).json({ message: 'Course updated successfully' })
    return
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
    return
  }
}
export { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse }
