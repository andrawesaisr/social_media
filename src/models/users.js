const mongoose = require("mongoose");
const jwt=require('jsonwebtoken')
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    follower: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    profilePic: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    tokens:[
      {
        token:{
          type:String,
          required:true
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createAuthToken=async function(){
  const user= this
  const token= await jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY,{expiresIn:'24h'})
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
}


const User = mongoose.model("User", userSchema);

module.exports = User;
