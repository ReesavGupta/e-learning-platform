import { Router } from 'express'
import { lessonController } from '../controllers/lesson.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = Router()

router.post(
  '/:courseId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  lessonController.createLesson
)

router.get(
  '/course/:courseId',
  authMiddleware,
  lessonController.getLessonsByCourse
)

router.get('/:lessonId', authMiddleware, lessonController.getLessonById)

router.put(
  '/:lessonId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  lessonController.updateLesson
)

router.delete(
  '/:lessonId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  lessonController.deleteLesson
)

export default router
