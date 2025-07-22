import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function authJWT(req,res,next){
    const authHeader = req.header('Authorization') || ''
    const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    :null

    if (!token){
        res.status(401).json({error: 'Authorization token missing' })
    }

    try {
        const payload = jwt.verify(token,JWT_SECRET)
        req.userId = payload.userId
        next()
    } catch (error) {
        return res.status(401).json({error:'Invalid or expired token'})
    }
}