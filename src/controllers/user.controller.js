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
    ).select("-password")

    return res.status(200)
        .json({
            user,
            msg: "User Updated Successfully"
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

//refresh access token
const refreshAccessToken = async (req, res) => {
    const incomingAccessToken = req.cookies.accessToken || req.body.accessToken

    if (!incomingAccessToken) {
        return res.status(401).json({
            "error": "Refresh Token Not Found"
        })
    }

    try {
        const user = await jwt.verify(incomingAccessToken, process.env.REFRESH_TOKEN_SECRET)

        const incomingUser = await User.findById(user?._id)

        if (!incomingUser) {
            res.status(401).json({
                "error": "Invalid Refresh Token"
            })
        }

        if (incomingAccessToken !== incomingUser?.accessToken) {
            res.status(401).json({
                "error": "Incorrect Refresh Token"
            })
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(incomingUser?._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                accessToken,
                newRefreshToken
            })
    } catch (error) {
        return res.status(401).json({
            "error": error?.message || "Invalid Refresh Token",
        })
    }
}

// changed current password 
const changeCurrentPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        return res.status(400)
            .json({
                error: "Invalid Old Password"
            })
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json({
            msg: "Password Successfully Changed"
        })
}

// get current user information 
const getCurrentUser = async (req, res) => {
    return res.status(200)
        .json({
            user: req.user,
            msg: "Current User Fetch Successfully"
        })
}

const getUserProfileDetails = async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        return res.status(400).json({
            error: "Username name is missing"
        })
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "userId",
                as: "user_reviews"
            }
        },
        {
            $addFields: {
                review_count: {
                    $size: "$user_reviews"
                }
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                review_count: 1
            }
        }
    ])

    if (!profile?.length()) {
        return res.status(404).json({
            error: "Profile Does not exist"
        })
    }

    return res.status(200)
        .json({
            profile: profile[0],
            msg: "profile fetch successfully"
        })
}

export {
    registerUser,
    loginUser,
    updateUser,
    userLoggedOut,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser
}
