import { Request, Response, RequestHandler } from 'express'
import { User } from '../models/user.model'

const userSignUp: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    if (!username || !email || !password || !role) {
      res.status(400).json({ message: 'Please fill in all fields' })
      return
    }

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

const userSignIn: RequestHandler = async (req, res) => {
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
    // Send the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    })

    res
      .status(200)
      .json({ token: token, message: 'User signed in successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export { userSignUp, userSignIn }
