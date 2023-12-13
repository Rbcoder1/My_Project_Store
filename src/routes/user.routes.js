import { Router } from 'express'
import { registerUser, loginUser, updateUser } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update-user').put([auth], updateUser)

export default router;