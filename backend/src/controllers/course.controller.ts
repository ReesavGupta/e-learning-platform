import { Request, Response, RequestHandler } from 'express'
import mongoose from 'mongoose'
import { Course } from '../models/course.model'

const createCourse = async (req: Request, res: Response) => {
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

    const newCourse = await Course.create({ title, description, instructor })

    res.status(201).json(newCourse)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const deleteCourse = async (req: Request, res: Response) => {
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

const getAllCourses: RequestHandler = async (req: Request, res: Response) => {
  try {
    // const allCourses = await Course.find()
    //   .populate('instructor', 'name email _id')
    //   .populate('lessons')

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
        $lookup: {
          from: 'lessons',
          foreignField: '_id',
          localField: 'lessons',
          as: 'lessons',
        },
      },
      {
        $unwind: {
          path: '$instructor',
          preserveNullAndEmptyArrays: true,
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

const getCourse = async (req: Request, res: Response) => {
  try {
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
          localField: 'instructor',
          foreignField: '_id',
          as: 'instructor',
        },
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessons',
          foreignField: '_id',
          as: 'lessons',
        },
      },
      {
        $unwind: {
          path: '$instructor',
          preserveNullAndEmptyArrays: true,
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

const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params._id
    const { title, description, instructor } = req.body

    if (!title || !description || !instructor) {
      res.status(400).json({ message: 'Please fill in all fields' })
      return
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(instructor)
    ) {
      res.status(400).json({ message: 'Invalid course or instructor ID' })
      return
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, instructor },
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

export { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse }
