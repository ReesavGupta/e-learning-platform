import mongoose from 'mongoose'

interface schema {
  userId: mongoose.Schema.Types.ObjectId
  result: Number
  submittedAt: Date
}

const submissionSchema = new mongoose.Schema<schema>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  result: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

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
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    submissions: [submissionSchema],
  },
  {
    timestamps: true,
  }
)

export const Quiz = mongoose.model('Quiz', QuizSchema)
