import express from "express";
import faker from "faker";

import { validateProduct, Product } from "../models/product.js";
import checkJWT from "../middleware/checkJWT.js"
import uploadMiddleware from "../middleware/uploadImage.js";
const router = express.Router();

router.route("/products")
    .get(checkJWT, async (req, res, next)=>{
        let products = await Product.find({owner: req.decoded._id})
            .populate("category")
            .populate("owner")
        res.json({
            success: true,
            message: "Fetched Projects",
            products: products
        })
    
    })
    .post([checkJWT, uploadMiddleware], async (req, res, next)=>{

        let { error } = validateProduct(req.body);
        if(error) return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        let product = new Product(req.body);
        product.image = req.file.path;
        product.owner = req.decoded._id
        await product.save();
        res.json({
            success: true,
            message: "Successfully added new product!"
        })

    })
//seed
router.post("/faker/seed", (req, res, next)=>{
    for(let i = 0; i< 20; i++){
        let product = new Product();
        product.owner = "5f06d0ccbd877e27681448f0";
        product.category = "5f078a433f84d62690f71029";
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
        
    }
})

export default router;