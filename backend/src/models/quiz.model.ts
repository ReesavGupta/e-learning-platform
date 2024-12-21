import mongoose from 'mongoose'

const QuizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Quiz = mongoose.model('Quiz', QuizSchema)
