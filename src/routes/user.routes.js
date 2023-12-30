import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js';
import {
    registerUser,
    loginUser,
    updateUser,
    userLoggedOut,
    changeCurrentPassword,
    getUserProfileDetails
} from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// secure routes 
router.route('/update-user').put([auth], updateUser)
router.route('/loggedout').post([auth], userLoggedOut)
router.route('/refresh-token').post(refreshAccessToken)
router.route('change-password').post([auth], changeCurrentPassword)
router.route('/current-user').get([auth], getUserProfileDetails)

export default router;