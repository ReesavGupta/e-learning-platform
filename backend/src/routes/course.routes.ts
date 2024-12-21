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
router.get('/:_id', authMiddleware, getCourse)
router.post(
  '/',
  authMiddleware,
  authorize(['admin', 'instructor']),
  createCourse
)
router.put(
  '/:_id',
  authMiddleware,
  authorize(['admin', 'instructor']),
  updateCourse
)
router.delete(
  '/:_id',
  authMiddleware,
  authorize(['admin', 'instructor']),
  deleteCourse
)

export default router
