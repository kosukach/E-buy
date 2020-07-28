import express from "express";
import Stripe from "stripe";


import {validateCategory, Category} from "../models/category.js";
import { Product } from "../models/product.js";
import { Review, validateReview } from "../models/review.js";
import { Order } from "../models/order.js";
import checkJwt from "../middleware/checkJWT.js";

const router = express.Router();
const stripe = new Stripe("sk_test_51H4PSvEsunicedYPixOGQA9Tm6M8gmTim3Cbc8zL78bP2p57MEuPqlN7X5NEcYu4pWeIWBjVIzRsj0rphUJd5caq004K5yF4tc")


router.route("/categories")
    .get(async (req, res, next)=>{
        const categories = await Category.find();
        res.json({
            success: true,
            message: "Fetched all categories",
            categories: categories
        })
    })
    .post(async (req, res, next)=>{
        const { error } = validateCategory(req.body);
        if(error) res.status(400).json({
            success: false,
            message: error.details[0].message
        }) 
        let category = new Category(req.body);
        await category.save();
        res.json({
            success: true,
            message: "Successfully created a new category!"
        })
    })

router.get("/categories/:id", async (req, res, next)=>{
    //PAGINATION
    try {
        
        const perPage = 10;
        const page = req.query.page;
        const productCount = await Product.countDocuments({category: req.params.id});
        const products = await Product.find({category: req.params.id})
            .skip(page*perPage)
            .limit(perPage)
            .populate("category")
            .populate("owner")
            .populate("review");
        const category = await Category.findById(req.params.id);
        res.json({
            success: true,
            message: "Success",
            products: products,
            categoryName: category["name"],
            totalProducts: productCount,
            pages: Math.ceil(productCount / perPage)
    
        });
    } catch (error) {
        res.json({
            success: false,
            message: error["message"]
        })
    }
});

router.get("/product/:id", async (req, res, next) => {
    try{
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("owner")
            .deepPopulate("reviews.author");
        if(!product) res.json({
            success: false,
            message: "Product not found"
        })
        res.json({
            success: true,
            message: "Fetched product by id.",
            product: product
        });
    }
    catch(error){
        res.json({
            success: false,
            message: error["message"]
        })
    }
});

router.get("/products", async (req, res, next) => {
    try {
        const perPage = 10;
        const page = req.query.page;
        const productCount = await Product.countDocuments();
        const products = await Product.find()
            .skip(perPage * page)
            .limit(perPage)
            .populate("owner")
            .populate("category")
            .populate("review");    

        
        res.json({
            success: true,
            message: "Success",
            products: products,
            totalProducts: productCount,
            pages: Math.ceil(productCount / perPage)
        });
        
    } catch (error) {
        res.json({
            success: false,
            message: error["message"]
        });
    }
});

router.post("/review", checkJwt, async (req, res, next)=>{
    const { error } = validateReview(req.body);
    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    const product = await Product.findById(req.body.productId);
    let review = new Review(req.body);
    review.author = req.decoded._id;
    review = await review.save();

    product.reviews.push(review.id);
    await product.save();
    res.json({
        success: true,
        message: "Created new review"
    });
});

router.post("/payment", checkJwt, (req, res, next)=>{
    const stripeToken = req.body.stripeToken;
    const currentCharges = Math.round(req.body.totalPrice * 100);
    stripe.charge
    stripe.customers.create({
            source: stripeToken.id
    })
    .then((customer)=>{
        return stripe.charges.create({
            amount: currentCharges,
            currency: "usd",
            customer: customer.id
        });
    })
    .then((charge)=>{
        const products = req.body.products;

        let order = new Order();
        order.owner = req.decoded._id;
        order.totalPrice = currentCharges;

        products.map(product => {
            order.products.push({
                product: product.product,
                quantity: product.quantity
            })
        });

        order.save();
        
        res.json({
            success: true,
            message: "Successfully made a payment"
        });
    });
});



export default router;