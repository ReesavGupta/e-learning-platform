import express from 'express'
import { userController } from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/signup', userController.userSignUp)
router.post('/signin', userController.userSignIn)

router.get('/signout', authMiddleware, userController.userSignOut)
router.get('/profile', authMiddleware, userController.getUserProfile)

export default router
