import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    //(1) get user details from frontend
    //(2) validation : not empty
    //(3) check if user already exists : using username, email
    //(4) check for images, check for avatar
    //(5) upload them to cloudinary,  avatar
    //(6) create user object - create entry in  db
    // (7) remove password and refresh token field from the response
    //(8) check for user creation
    //(9) return response
    
   //(1)
   const{fullname, username, email, password} = req.body
   console.log("email: ",email);

   //(2)
   if([fullname, username, email, password].some((field) => field?.trim() === "")){
    throw new ApiError(400, "All fiels are required");
   }

   //(3)
    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    //(4)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
   }

   //(5)
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   
   if(!avatar){//if the avatar has not been uploaded to cloudinary , throw error
    throw new ApiError(400, "Avatar file is required");
   }
   
   //(6)
    const user = await User.create({
    fullname,
    email,
    password,
    username : username.toLowerCase,
    avatar : avatar.url,
    coverImage : coverImage?.url || ""
   })

   //(7)
   const createdUser = await User.findById(user._id).select(
    "-passowrd -refreshToken"
   )

   //(8)
   if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
   }

   //(9)
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succesfully")
   )
})
   



export {registerUser};