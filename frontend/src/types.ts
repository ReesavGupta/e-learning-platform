export interface User {
  _id: string
  username: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  _id: string
  courseId: string
  title: string
  content?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Course {
  _id: string
  title: string
  description: string
  instructor: string
  lessons?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Option {
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string // Added id to uniquely identify each question
  text: string
  options: Option[]
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: Question[] // Changed from string[] to Question[] to hold full question objects
  createdAt?: string
  updatedAt?: string
}
