import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role

    if (!userRole || !roles.includes(userRole)) {
      res.status(401).json({ message: 'Not authorized to access this route' })
      return
    } else {
      next()
    }
  }
}
