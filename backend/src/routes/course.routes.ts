import { Router } from 'express'
import { courseController } from '../controllers/course.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = Router()

router.get(
  '/',
  // authMiddleware,
  // authorize(['admin', 'instructor']),
  courseController.getAllCourses
)
router.get('/:_id', authMiddleware, courseController.getCourse)
router.post(
  '/',
  authMiddleware,
  authorize(['admin', 'instructor']),
  courseController.createCourse
)
router.put(
  '/:_id',
  authMiddleware,
  authorize(['admin', 'instructor']),
  courseController.updateCourse
)
router.delete(
  '/:_id',
  authMiddleware,
  authorize(['admin', 'instructor']),
  courseController.deleteCourse
)
router.put(
  '/',
  authMiddleware,
  authorize(['student']),
  courseController.enrollInCourseAsStudent
)

export default router
