const bcrypt = require('bcrypt');
const User = require("../models/User");



//signup route handler
exports.signup = async (req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user is already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(401).json({
                success:false,
                message:'User already Exists',
            })
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                status:false,
                message:"Error in hashing password",
            });
        }

        //create entry for user
        const user = await User.create({
            name,
            email,
            hashedPassword,
            role,
        })

        return res.status(200).json({
            status:true,
            message:'User created successfully',
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later'
        })
    }
}