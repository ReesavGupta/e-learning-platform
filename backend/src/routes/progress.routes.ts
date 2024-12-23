import express from 'express'
import { progressController } from '../controllers/progress.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router = express.Router()

router.get(
  '/:studentId/course/:courseId',
  authMiddleware,
  progressController.getProgress.bind(progressController)
)

router.put(
  '/:studentId/course/:courseId',
  authMiddleware,
  progressController.updateProgress.bind(progressController)
)

router.put(
  '/:studentId/course/:courseId/lesson/:lessonId',
  authMiddleware,
  progressController.completeLesson.bind(progressController)
)

router.get(
  '/course/:courseId',
  authMiddleware,
  progressController.getCourseProgress.bind(progressController)
)

export default router
