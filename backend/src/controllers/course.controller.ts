import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Course } from '../models/course.model'
import asyncHandler from '../utils/asyncHandler'

class CourseController {
  // Create a new course
  public createCourse = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { title, description, instructor } = req.body

        if (!title || !description || !instructor) {
          res.status(400).json({ message: 'Please fill in all fields' })
          return
        }

        if (!mongoose.Types.ObjectId.isValid(instructor)) {
          res.status(400).json({ message: 'Invalid instructor ID' })
          return
        }

        const newCourse = await Course.create({
          title,
          description,
          instructor,
        })

        res.status(201).json(newCourse)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // Delete a course by ID
  public deleteCourse = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const courseId = req.params._id

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
          res.status(400).json({ message: 'Invalid course ID' })
          return
        }

        const course = await Course.findByIdAndDelete(courseId)

        if (!course) {
          res.status(404).json({ message: 'Course not found' })
          return
        }

        res.status(200).json({ message: 'Course deleted successfully', course })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // Get all courses
  public getAllCourses = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        console.log('im in get allcourse ')
        const allCourses = await Course.aggregate([
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'instructor',
              as: 'instructor',
            },
          },
          {
            $unwind: {
              path: '$instructor',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'lessons',
              let: { courseId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$course', '$$courseId'] } } },
                { $project: { _id: 1, title: 1, content: 1, order: 1 } },
              ],
              as: 'lessons',
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              instructor: { _id: 1, username: 1, email: 1 },
              lessons: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ])

        if (!allCourses || allCourses.length === 0) {
          res.status(404).json({ message: 'No courses found' })
          return
        }

        res.status(200).json(allCourses)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // Get a single course by ID
  public getCourse = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        console.log('im in get course by id')
        const courseId = req.params._id

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
          res.status(400).json({ message: 'Invalid course ID' })
          return
        }

        const course = await Course.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(courseId),
            },
          },
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'instructor',
              as: 'instructor',
            },
          },
          {
            $unwind: {
              path: '$instructor',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'lessons',
              let: { courseId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$course', '$$courseId'] } } },
                { $project: { _id: 1, title: 1, content: 1, order: 1 } },
              ],
              as: 'lessons',
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              instructor: { _id: 1, username: 1, email: 1 },
              lessons: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ])

        if (!course || course.length === 0) {
          res.status(404).json({ message: 'Course not found' })
          return
        }

        res.status(200).json(course[0])
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // Update a course by ID
  public updateCourse = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const courseId = req.params._id
        const { title, description } = req.body

        if (!title || !description) {
          res.status(400).json({ message: 'Please fill in all fields' })
          return
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
          res.status(400).json({ message: 'Invalid course' })
          return
        }

        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { title, description },
          { new: true }
        )

        if (!updatedCourse) {
          res.status(404).json({ message: 'Course not found' })
          return
        }

        res.status(200).json(updatedCourse)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  public enrollInCourseAsStudent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { userId, courseId } = req.body

        if (
          !userId ||
          !courseId ||
          !mongoose.Types.ObjectId.isValid(userId) ||
          !mongoose.Types.ObjectId.isValid(courseId)
        ) {
          res
            .status(400)
            .json({ message: 'Invalid or missing userId/courseId' })
        } else {
          const foundCourse = await Course.findById(courseId)

          if (!foundCourse) {
            res.status(404).json({ message: 'Course not found' })
          } else if (foundCourse.enrolledStudents.includes(userId)) {
            res
              .status(400)
              .json({ message: 'User already enrolled in this course' })
          } else {
            foundCourse.enrolledStudents.push(userId)

            try {
              await foundCourse.save()
              res
                .status(200)
                .json({ message: 'User enrolled in course successfully' })
            } catch (saveError) {
              res
                .status(500)
                .json({ message: 'Failed to save course enrollment' })
            }
          }
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: (error as any).message || 'Internal server error' })
      }
    }
  )
  public getEnrolledCourses = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { userId } = req.query
        if (!userId) {
          res.status(400).json({ message: 'User ID is required' })
          return
        }

        const enrolledCourses = await Course.find({ enrolledStudents: userId })

        res.status(200).json(enrolledCourses)
      } catch (error) {
        res.status(500).json({
          message: 'something went wrong while getting the enrolled users',
        })
      }
    }
  )
}

export const courseController = new CourseController()
