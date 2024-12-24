import express from 'express'
import { quizController } from '../controllers/quiz.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = express.Router()

router.post(
  '/',
  authMiddleware,
  authorize(['instructor', 'admin']),
  quizController.createQuiz
)

router.get('/', authMiddleware, quizController.getAllQuizzes)

router.get('/:id', authMiddleware, quizController.getQuizById)

router.put(
  '/:id',
  authMiddleware,
  authorize(['instructor', 'admin']),
  quizController.updateQuiz
)

router.delete(
  '/:id',
  authMiddleware,
  authorize(['instructor', 'admin']),
  quizController.deleteQuiz
)

export default router
