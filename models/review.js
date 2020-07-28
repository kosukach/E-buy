import mongoose from "mongoose";
import Joi from "@hapi/joi";

const ReviewSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    rating: {type: Number, min: 0, max: 5, default: 0},
    created: {type: Date, default: Date.now}
})

const Review = mongoose.model("Review", ReviewSchema);

function validateReview(review){
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        rating: Joi.number().min(0).max(5),
        productId: Joi.string(),
        created: Joi.date()
    })
    return Joi.validate(review, schema)
}

export {Review as Review, validateReview as validateReview};