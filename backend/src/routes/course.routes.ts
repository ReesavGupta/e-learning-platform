import { Router } from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  updateCourse,
} from '../controllers/course.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = Router()

router.get(
  '/',
  authMiddleware,
  authorize(['admin', 'instructor']),
  getAllCourses
)

export default router