import mongoose from "mongoose";

const PasswordSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
        select:false,
        minLength:[5, 'password too short']
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    } 
})