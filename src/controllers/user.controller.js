import { User } from "../models/user.model.js";

// user register controller 
const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    if (
        [username, email, password].some((field) => field?.trim() === "")
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
        password
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
    return res.status(201).json({ createdUser })
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

    if(!validUser){
        return res.status(402).send("User Does Not Exist")
    }

    const validPass = await validUser.isPasswordCorrect(password)
    
    if(!validPass){
        return res.status(402).send("Enter Valid Password")
    }

    return res.send(validUser)
}

export { registerUser, loginUser }
