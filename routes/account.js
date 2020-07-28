import express from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { validateUser, User } from "../models/user.js";
import bcrypt from "bcrypt";


const router = express.Router();

router.post("/singup", async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).json({
        success: false,
        message: "Email Address Already in Use"
    });

    user = new User(req.body);
    user.picture = user.gravatar();
    user = await user.save();

    return success(res, user._id);
});

router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    
    if(!user) return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if(!match) return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
    });

    return success(res, user._id);
});

function success(res, id){
    let token = jwt.sign(
        {_id: id},
        config.get("secret"),
        {expiresIn: "30d"}
    );
    
    return res.json({
        success: true,
        message: "Success!",
        token: token
    })
}



export default router;