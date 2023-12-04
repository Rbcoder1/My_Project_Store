import { User } from "../models/user.model.js";

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

export { registerUser }
