import express from 'express'
import { userSignUp, userSignIn } from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'

const router = express.Router()

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)

export default router
