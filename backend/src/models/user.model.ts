import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface IUser extends mongoose.Document {
  username: string
  email: string
  password: string
  role: 'student' | 'instructor' | 'admin'
  matchPassword: (enteredPassword: string) => Promise<boolean>
  generateAuthToken: () => Promise<string>
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified(`password`)) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '30d',
    }
  )
  return token
}

export const User = mongoose.model('User', UserSchema)
