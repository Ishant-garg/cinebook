
import jwt from "jsonwebtoken";
export const generateToken = (userId , res) =>{

    const token = jwt.sign({ userId }, process.env.JWT_KEY, 
        { expiresIn: '7d' }
    );
    // console.log(token , "fromtttt");
    res.cookie('jwt' , token , {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token
}