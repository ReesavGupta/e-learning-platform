import { Router } from 'express'
import { questionController } from '../controllers/question.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = Router()

router.post(
  '/create',
  authMiddleware,
  authorize(['admin', 'instructor']),
  questionController.createQuestion
)

router.get(
  '/quiz/:quizId',
  authMiddleware,
  authorize(['admin', 'instructor', 'student']),
  questionController.getQuestionsByQuiz
)

router.get(
  '/:questionId',
  authMiddleware,
  authorize(['admin', 'instructor', 'student']),
  questionController.getQuestionById
)

router.put(
  '/:questionId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  questionController.updateQuestion
)

router.delete(
  '/:questionId',
  authMiddleware,
  authorize(['admin', 'instructor']),
  questionController.deleteQuestion
)

export default router
