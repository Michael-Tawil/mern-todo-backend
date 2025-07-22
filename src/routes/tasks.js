import express from 'express'
import Task from '../models/Task.js'
import { authJWT } from '../middleware/auth.js'

const router = express.Router()

router.use(authJWT)

router.get('/',async (req,res)=>{
    const userId = req.userId
    const tasks = await Task.find({
        $or:[
            {owner:userId},
            {sharedWith:userId}
        ]
    }).sort({createdAt:-1})
    res.json(tasks)
})

router.post('/', async (req,res)=>{
    const userId = req.userId
    const {text} = req.body
    if (!text||!text.trim()){
        return res.status(400).json({error: 'text is required'})
    }
    const task = await Task.create({text:text.trim(),owner:userId})
    res.status(201).json(task)
})

router.patch('/:id',async(req,res)=>{
    const userId = req.userId
    const {id} = req.params
    const updates ={}

    if (req.body.text !== undefined){
        if(!req.body.text.trim()){
            return res.status(400).json({error:'text must be non-empty'})
        }
        updates.text = req.body.text.trim()
    }
    if (req.body.done !== undefined){
        updates.done = boolean(req.body.done)
    }

    const task = await Task.findOneAndUpdate(
        {_id:id,$or:[{owner:userId},{sharedWith:userId}]},
        {$set:updates,updatedAt:Date.now()},
        {new:true}
    )
    if(!task){
        return res.status(404).json({error:'Task not found or access denied'})
    }
    res.json(task)
})

router.delete('/:id', async (req,res)=>{
    const userId = req.userId
    const {id} = req.params
    const result = await Task.findOneAndDelete({_id:id, owner:userId})

    if (!result){
        return res.status(404).json({error: 'task not found or not owned by you'})
    }
    res.status(204).end()
})

router.post('/:id/share',async (req,res)=>{
    const userId = req.userId
    const {id} = req.params
    const {email} = req.body

    const task = await Task.findOne({_id:id,owner:userId})
    if (!task){
        return res.status(404).json({error:'task not found or not owned by you'})
    }
    const userToShare  =await User.findOne({email:email.toLowerCase().trim()})
    if (!userToShare){
        res.status(404).json({error:'User to share with not found'})
    }

    if (!task.sharedWith.includes(userToShare._id)){
        task.sharedWith.push(userToShare._id)
        await task.save()
    }
    res.json(task)
})
export default router;