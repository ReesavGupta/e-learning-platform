import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'

export interface AuthRequest extends Request {
  user?: { id: string; role: string }
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    res
      .status(401)
      .json({ message: 'You are not authorized to access this route' })
    return
  }
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }

    const decodedToken = jwt.verify(token, secret)

    if (typeof decodedToken === 'object' && decodedToken !== null) {
      req.user = { id: decodedToken._id, role: decodedToken.role }
    }
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' })
    return
  }
}

export default authMiddleware
