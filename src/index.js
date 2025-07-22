import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import tasksroutes from './routes/tasks.js'
import userrouter from './routes/user.js'

const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())


mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MONGODB Connected"))
.catch(err=>{console.log(`MONGODB Connection error: ${err}`)
process.exit(1)})

app.use('/auth',userrouter)

app.use('/tasks',tasksroutes)


app.get('/ping',(req,res)=>res.send('Pong'))

// Mount auth&task routes here

app.listen(PORT,()=>{console.log(`Server running on http://localhost:${PORT}`)})