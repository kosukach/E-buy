import mongoose from "mongoose";
import Joi from "@hapi/joi";

const categorySchema = new mongoose.Schema({
    name: {type: String, unique: true, lowercase: true},
    created: { type: Date, default: Date.now},


})

const Category = mongoose.model("Category", categorySchema)

function validateCategory(category){
    const schema = Joi.object({
        name: Joi.string().required(),
        create: Joi.date()
    });
    return Joi.validate(category, schema);
}

export {validateCategory as validateCategory, Category as Category}