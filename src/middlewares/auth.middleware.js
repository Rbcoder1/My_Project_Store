import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("unauthorized User");
    }

    const userToken = authHeader.split(" ")[1];

    const { _id, email, username } = await jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);

    const user = {
        id: _id,
        email,
        username
    }

    req.user = user;

    next();
}

export { auth };