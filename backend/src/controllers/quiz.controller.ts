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
      const {
        lesson,
        title,
        questions,
      }: { lesson: string; title: string; questions?: QuestionInput[] } =
        req.body

      if (!lesson || !title) {
        res.status(400).json({ message: 'Lesson ID and title are required' })
        return
      }

      const lessonExists = await Lesson.findById(lesson)
      if (!lessonExists) {
        res.status(404).json({ message: 'Lesson not found' })
        return
      }

      const quiz = await Quiz.create({ lesson, title, questions: [] })

      if (Array.isArray(questions) && questions.length > 0) {
        const createdQuestions = await Promise.all(
          questions.map(async (question) => {
            const newQuestion = await Question.create({
              ...question,
              quiz: quiz._id,
            })
            return newQuestion._id
          })
        )
        quiz.questions = createdQuestions
        await quiz.save()
      }

      res.status(201).json({ message: 'Quiz created successfully', data: quiz })
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
