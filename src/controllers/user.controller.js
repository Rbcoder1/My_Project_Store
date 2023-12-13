import { User } from "../models/user.model.js";

// user register controller 
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body

    if (
        [username, email, password, role].some((field) => field?.trim() === "")
    ) {
        return res.send("Some Field Is Empty");
    }

    // checking that user is exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        return res.send("User Already Exist");
    }

    const user = await User.create({
        username,
        email,
        password,
        role
    })

    // removing password and refresh token user 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // confirming user creation 
    if (!createdUser) {
        res.status(500)
        res.send("Something Went Wrong While Creating User")
    }

    const userToken = createdUser.generateAccessToken();

    return res.status(201).json(userToken);
}

// user login controller 
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "")
    ) {
        return res.status(401).send("All Field Required");
    }

    const validUser = await User.findOne({ email })

    if (!validUser) {
        return res.status(402).send("User Does Not Exist")
    }

    const validPass = await validUser.isPasswordCorrect(password)

    if (!validPass) {
        return res.status(402).send("Enter Valid Password")
    }

    const userToken = validUser.generateAccessToken();

    return res.status(200).json({ userToken });
}

// update user controller
const updateUser = async (req, res) => {
    const { username, email } = req.body

    if (
        [username, email].some((field) => field?.trim() === "")
    ) {
        return res.send("Some Field Is Empty");
    }

    const newUser = {
        username,
        email
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.user.id }, newUser)
        return res.json(user)
    } catch (e) {
        res.status(501).json({
            "errror": e
        })
    }
}

export { registerUser, loginUser, updateUser }
