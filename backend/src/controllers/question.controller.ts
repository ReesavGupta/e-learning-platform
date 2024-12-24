import { Request, Response } from 'express'
import { Question } from '../models/question.model'
import asyncHandler from '../utils/asyncHandler'

class QuestionController {
  // Create a new question
  public createQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { quiz, text, options } = req.body

      if (!quiz || !text || !Array.isArray(options) || options.length === 0) {
        res.status(400).json({ message: 'Invalid question data' })
        return
      }

      const hasCorrectOption = options.some((option: any) => option.isCorrect)
      if (!hasCorrectOption) {
        res
          .status(400)
          .json({ message: 'At least one option must be marked as correct' })
        return
      }

      const question = await Question.create({ quiz, text, options })

      res
        .status(201)
        .json({ message: 'Question created successfully', data: question })
    }
  )

  // Get all questions for a quiz
  public getQuestionsByQuiz = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { quizId } = req.params

      if (!quizId) {
        res.status(400).json({ message: 'Quiz ID is required' })
        return
      }

      const questions = await Question.find({ quiz: quizId }).populate(
        'quiz',
        'title'
      )

      if (!questions || questions.length === 0) {
        res.status(404).json({ message: 'No questions found for this quiz' })
        return
      }

      res
        .status(200)
        .json({ message: 'Questions retrieved successfully', data: questions })
    }
  )

  // Get a single question by its ID
  public getQuestionById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { questionId } = req.params

      if (!questionId) {
        res.status(400).json({ message: 'Question ID is required' })
        return
      }

      const question = await Question.findById(questionId).populate(
        'quiz',
        'title'
      )

      if (!question) {
        res.status(404).json({ message: 'Question not found' })
        return
      }

      res
        .status(200)
        .json({ message: 'Question retrieved successfully', data: question })
    }
  )

  // Update a question
  public updateQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { questionId } = req.params
      const { text, options } = req.body

      if (!questionId) {
        res.status(400).json({ message: 'Question ID is required' })
        return
      }

      if (!text || !Array.isArray(options) || options.length === 0) {
        res.status(400).json({ message: 'Invalid question data' })
        return
      }

      const hasCorrectOption = options.some((option: any) => option.isCorrect)
      if (!hasCorrectOption) {
        res
          .status(400)
          .json({ message: 'At least one option must be marked as correct' })
        return
      }

      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { text, options },
        { new: true }
      )

      if (!updatedQuestion) {
        res.status(404).json({ message: 'Question not found' })
        return
      }

      res.status(200).json({
        message: 'Question updated successfully',
        data: updatedQuestion,
      })
    }
  )

  // Delete a question
  public deleteQuestion = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { questionId } = req.params

      if (!questionId) {
        res.status(400).json({ message: 'Question ID is required' })
        return
      }

      const deletedQuestion = await Question.findByIdAndDelete(questionId)

      if (!deletedQuestion) {
        res.status(404).json({ message: 'Question not found' })
        return
      }

      res.status(200).json({
        message: 'Question deleted successfully',
        data: deletedQuestion,
      })
    }
  )
}

export const questionController = new QuestionController()
