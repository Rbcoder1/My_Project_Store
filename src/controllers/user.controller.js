import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById({ userId })

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        return res.status(500).send("Error While Created Access And Refresh Token")
    }
}

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

    return res.status(201).send("User Register Successfully");
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(validUser._id)

    validUser = await User.findById(validUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json({
            user: validUser,
            accessToken,
            refreshToken
        }).
        send("User LoggedIn Successfully")

}

// update user controller
const updateUser = async (req, res) => {
    const { username } = req.body

    if (
        [username].some((field) => field?.trim() === "")
    ) {
        return res.send("Some Field Is Empty");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                username
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json({
            user
        })
}

// logged out user
const userLoggedOut = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            "msg": "User Logged Out"
        })
}

export {
    registerUser,
    loginUser,
    updateUser,
    userLoggedOut
}
