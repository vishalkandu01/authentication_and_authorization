
// auth, isStudent, isAdmin

const User = require("../models/User");
const jwt = require('token');
require("dotenv").config();


exports.auth = async (req, res, next) => {
    try{
        // const {email, token} = req.body;
        // const user = User.findOne({email});
        //extract JWT token

        console.log('cookie', req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ",  "");

        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'token missing',
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env_JWT_SECRET);
            console.log(payload);

            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            })
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        })
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== 'Student') {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students",
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is ot matching',
        })
    }
}

exports.isAdmin = (req, res, next) {
    try{
        if(req.user.role !== 'Admin') {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admin',
            })
        }
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}