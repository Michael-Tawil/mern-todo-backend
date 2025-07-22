import mongoose, { model } from "mongoose"

const taskschema = mongoose.Schema({
    text:{
        type:String,
        required:true,
        trim:true
    },
    done:{
        type:Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    sharedWith:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }]
},{timestamps:true})

export default mongoose.model('Task',taskschema)