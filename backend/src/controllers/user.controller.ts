import { Request, Response } from 'express'
import { User } from '../models/user.model'
import { AuthRequest } from '../middlewares/auth.middleware'
import asyncHandler from '../utils/asyncHandler'

class UserController {
  // User Sign Up
  public userSignUp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { username, email, password, role } = req.body
        console.log(req.body)
        if (!username || !email || !password || !role) {
          res.status(400).json({ message: 'Please fill in all fields' })
          return
        }
        console.log('here')
        const user = await User.findOne({ email })
        if (user) {
          res.status(400).json({ message: 'User already exists' })
          return
        }

        const newUser = new User({ username, email, password, role })
        await newUser.save()

        res.status(201).json({ message: 'User created successfully' })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // User Sign In
  public userSignIn = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body

        if (!email || !password) {
          res.status(400).json({ message: 'Please fill in all fields' })
          return
        }

        const user = await User.findOne({ email })
        if (!user) {
          res.status(400).json({ message: 'Invalid credentials' })
          return
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
          res.status(400).json({ message: 'Invalid credentials' })
          return
        }

        const token = await user.generateAuthToken()
        console.log(token.toString())
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000, // 1 hour
        })

        res.status(200).json(user)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )
  // User Sign Out
  public userSignOut = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        res.status(200).json({ message: 'User signed out successfully' })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )

  // Get User Profile
  public getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      try {
        const userId = req.user?.id
        if (!userId) {
          res.status(401).json({ message: 'Unauthorized' })
          return
        }

        const user = await User.findById(userId).select('-password')
        if (!user) {
          res.status(404).json({ message: 'User not found' })
          return
        }

        res.status(200).json(user)
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
      }
    }
  )
}

export const userController = new UserController()
