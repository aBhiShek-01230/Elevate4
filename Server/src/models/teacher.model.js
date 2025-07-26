import mongoose, { Schema } from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const teacherSchema = new mongoose.Schema({

    username:{
      type:String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
      index:true
    },
    email:{
      type:String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
    },
    fullName:{
      type:String,
      required : true,
      trim : true,
      index : true
    },
    password:{
      type: String,
      required: [true, 'Password is required']
    },
    avatar: {
      type: String, // cloudinary url
    },
    aboutMe :{
      type: String
    },
    skills:[

    ],
    courses:[
      {
      type : Schema.Types.ObjectId,
      ref :"Course"
      }
    ],
    labs:[
      {
      type : Schema.Types.ObjectId,
      ref :"Lab"
      }
    ],
    refreshToken: {
      type: String
    }

},{timestamps:true})


teacherSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

teacherSchema.methods.isPassWordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}

teacherSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
teacherSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Teacher = mongoose.model("Teacher",teacherSchema)