import express from 'express'
import {
  userSignUp,
  userSignIn,
  userSignOut,
  getUserProfile,
} from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = express.Router()

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)

router.get('/signout', authMiddleware, userSignOut)
router.get('/profile', authMiddleware, getUserProfile)

export default router
