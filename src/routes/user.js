import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import 'dotenv/config'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

//signup------------------------------------

router.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body
    if (!name || !email || !password){
        return res.status(400).json({error:'Name, Email and password are required'})
    }
    if (await User.findOne({email})){
        return res.status(409).json({error:'Email already in use'})
    }
    const hash = await bcrypt.hash(password,10)
    const user = await User.create({name,email,password:hash})
    const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'2h'})
    res.status(201).json({token})
})

//login--------------------------------------------

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if (!email || !password){
        return res.status(400).json({error:'Email and password are required'})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json({error:'Invalid credentials'})
    }
    const match  = await bcrypt.compare(password,user.password)
    if (!match){
        return res.status(401).json({error:'Invalid password'})
    }
    const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'2h'})
    res.json({token})
})

export default router