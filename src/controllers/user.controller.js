import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    // get user details from frontend 
    // validation - not empty
    // check if user already exists : email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res 

    const { username, email, password } = req.body
    console.log("email :", email);

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        res.send("something went wrong");
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        res.send("User Already Exist");
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        res.status(500)
        res.send("Something Went Wrong While Creating User")
    }

    return res.status(201).json({createdUser})
}

export { registerUser }
