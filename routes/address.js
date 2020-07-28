import express from "express";
import { validateUser, User } from "../models/user.js";
import checkJWT from "../middleware/checkJWT.js";
const router = express.Router();

router.route("/address")
    .get(checkJWT, async (req, res)=>{
        try{
            let user = await User.findById(req.decoded._id);
            res.json({
                success: true,
                message: "Successful!",
                address: user.address
            });
        }
        catch(error){
            res.status(403).json({
                success: false,
                message: error["message"]
            })
        }

    })
    .post(checkJWT, async(req, res, next)=>{
        try{
            
            
            let user = await User.findById(req.decoded._id)
            for(let props in req.body){
                user.address[props] = req.body[props];
                
            }
            await user.save()
            
            res.json({
                success: true,
                message: "Successfully updated your address.",
                address: user.address
            });
        }
        catch(error){
            res.status(403).json({
                success: false,
                message: error["message"]
            });
            
        }
    })
export default router;