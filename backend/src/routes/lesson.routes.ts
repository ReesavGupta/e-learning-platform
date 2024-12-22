import { Router } from 'express'
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  authorize(['admin', 'instructor']),
  createLesson
)

router.get('/course/:courseId', authMiddleware, getLessonsByCourse)

router.get('/:lessonId', authMiddleware, getLessonById)

router.put(
  '/:lessonId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  updateLesson
)

router.delete(
  '/:lessonId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  deleteLesson
)

export default router
