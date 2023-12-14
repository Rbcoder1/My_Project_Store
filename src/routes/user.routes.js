import { Router } from 'express'
import { registerUser, loginUser, updateUser, userLoggedOut } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// secure routes 
router.route('/update-user').put([auth], updateUser)
router.route('/loggedout').post([auth], userLoggedOut)

export default router;