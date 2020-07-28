import express from "express";
import { Order } from "../models/order.js";
import checkJWT from "../middleware/checkJWT.js";

const router = express.Router();
router.get("/orders", checkJWT, async (req, res, next)=>{
    
    const orders = await Order.find({owner: req.decoded._id})
        .populate("products.product")
        .populate("owner")
    if(!orders) return res.status(400).json({
        success: false,
        message: "Failed to find order",

    })

    res.json({
        success: true,
        message: "Found your order",
        orders: orders
    })
})   
        
router.get("/orders/:id", checkJWT, async (req, res, next)=>{
    
    const order = await Order.findById(req.params.id)
        .deepPopulate("products.product.owner")
        .populate("owner")
    if(!order) return res.status(400).json({
        success: false,
        message: "Failed to find order",

    })

    res.json({
        success: true,
        message: "Found your order",
        order: order
    })
    
        
   
})
export default router;