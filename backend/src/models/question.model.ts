import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
)

QuestionSchema.pre('save', function (next) {
  const question = this as any

  if (!question.options.some((option: any) => option.isCorrect)) {
    const error = new Error('At least one option must be marked as correct')
    return next(error)
  }

  next()
})

export const Question = mongoose.model('Question', QuestionSchema)
