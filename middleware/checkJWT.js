import jwt from "jsonwebtoken";
import config from "config";

async function check(req, res, next){
    let token = req.headers["authorization"];
    if(!token) return res.status(403).json({
        success: false,
        message: "Forbidden"
    }) 
    jwt.verify(token, config.get("secret"), (err, decoded)=>{
        if(err){
            res.status(403).json({
                success: false,
                message: err["message"]
            })
        }
        req.decoded = decoded;
        next();
    })   
}
export default check;