import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { Quiz } from '../models/quiz.model'
import { Lesson } from '../models/lesson.model'
import { Question } from '../models/question.model'
import mongoose from 'mongoose'

interface QuestionInput {
  text: string
  options: { text: string; isCorrect: boolean }[]
}

class QuizController {
  public createQuiz = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const {
          lesson,
          title,
          questions,
        }: { lesson: string; title: string; questions?: QuestionInput[] } =
          req.body

        console.log('Received request body:', req.body)

        if (!lesson || !mongoose.Types.ObjectId.isValid(lesson)) {
          res.status(400).json({ message: 'Invalid or missing lesson ID' })
          return
        }

        if (!title) {
          res.status(400).json({ message: 'Title is required' })
          return
        }

        console.log('Validating lesson existence...')
        const lessonExists = await Lesson.findById(lesson)
        if (!lessonExists) {
          res.status(404).json({ message: 'Lesson not found' })
          return
        }

        console.log('Creating quiz...')

        const quiz = await Quiz.create({
          lesson,
          title,
          questions: [],
        })
        await quiz.save()
        console.log('Quiz created:', quiz)

        if (!quiz) {
          res.status(500).json({ message: 'Failed to create quiz' })
          return
        }

        if (Array.isArray(questions) && questions.length > 0) {
          console.log('Creating associated questions...')

          const createdQuestions = await Promise.all(
            questions.map(async (question) => {
              if (!question.text || !Array.isArray(question.options)) {
                throw new Error('Invalid question data')
              }
              const newQuestion = await Question.create({
                ...question,
                quiz: quiz._id,
              })
              await newQuestion.save()
              return newQuestion._id
            })
          )

          // Only update the quiz if questions were successfully created
          if (createdQuestions.length > 0) {
            quiz.questions = createdQuestions
            await quiz.save()
          }

          console.log('Questions added to quiz:', createdQuestions)
        }

        res.status(201).json({
          message: 'Quiz created successfully',
          data: quiz,
        })
      } catch (error) {
        console.error('Error occurred during quiz creation:', error)
        res.status(500).json({
          message: 'An internal error occurred',
          error: (error as any).message,
        })
      }
    }
  )

  getAllQuizzes = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const quizzes = await Quiz.find().populate('lesson', 'title').populate({
        path: 'questions',
        select: 'text options',
      })

      res.status(200).json({ data: quizzes })
    }
  )

  getQuizById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params

      const quiz = await Quiz.findById(id)
        .populate('lesson', 'title')
        .populate({
          path: 'questions',
          select: 'text options',
        })

      if (!quiz) {
        res.status(404).json({ message: 'Quiz not found' })
        return
      }

      res.status(200).json({ data: quiz })
    }
  )

  updateQuiz = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params
      const {
        title,
        questions,
      }: { title?: string; questions?: QuestionInput[] } = req.body

      const quiz = await Quiz.findById(id)
      if (!quiz) {
        res.status(404).json({ message: 'Quiz not found' })
        return
      }

      if (title) quiz.title = title

      if (Array.isArray(questions)) {
        const updatedQuestions = await Promise.all(
          questions.map(async (question) => {
            if ((question as any)._id) {
              const updatedQuestion = await Question.findByIdAndUpdate(
                (question as any)._id,
                question,
                { new: true }
              )
              return updatedQuestion?._id
            } else {
              const newQuestion = await Question.create({
                ...question,
                quiz: quiz._id,
              })
              return newQuestion._id
            }
          })
        )

        quiz.questions = updatedQuestions.filter(
          (questionId): questionId is mongoose.Types.ObjectId =>
            questionId !== null
        )
      }

      await quiz.save()
      res.status(200).json({ message: 'Quiz updated successfully', data: quiz })
    }
  )

  deleteQuiz = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params

      const quiz = await Quiz.findById(id)
      if (!quiz) {
        res.status(404).json({ message: 'Quiz not found' })
        return
      }

      await Question.deleteMany({ quiz: quiz._id })
      await Quiz.findByIdAndDelete(id)

      res.status(200).json({ message: 'Quiz deleted successfully' })
    }
  )
}

export const quizController = new QuizController()
