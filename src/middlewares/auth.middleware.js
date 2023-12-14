import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const auth = async (req, res, next) => {
    const accessTokem = req.cookie?.accessToken || req.headers("Authorization").replace("Bearer ", "")

    if (!accessTokem) {
        return res.status(401).send("unauthorized User");
    }

    const { _id } = await jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(_id).select("-password -refreshToken")

    req.user = user;
    next();
}

export { auth };