import mongoose from "mongoose";
import Joi from "@hapi/joi";
import deepPopulate from "mongoose-deep-populate";
import mongooseAlgolia from "mongoose-algolia";

let deepPopulatePlug = deepPopulate(mongoose);


const productSchema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],
    image: String,
    title: String,
    description: String,
    price: Number,
    created: {type: Date, default: Date.now},

},
{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

productSchema.virtual("averageRating")
    .get(function() {
        let rating = 0;
        this.reviews.map(rev =>{
            rating += rev.rating
        });
        if(this.reviews.length) rating /= this.reviews.length;
        return rating;
    });


productSchema.plugin(deepPopulatePlug);
productSchema.plugin(mongooseAlgolia,{
    appId: "B7H58PYGWD",
    apiKey: "16d97ea5bbe5915190ef3059f4be5dd7",
    indexName: "e-buy1",
    selector: "_id title image reviews description price owner created averageRating",
    populate: {
        path: "owner reviews",
        select: "name rating"
    },
    defaults: {
        author: "unknown"
    },
    mappings: {
        title: function(value){
            return `${value}`
        }
    },
    virtuals: {
        /*averageRating: function(doc){
            let rating = 0;
            doc.reviews.map(rev =>{
                rating += rev.rating
            });
            if(doc.reviews.length) rating /= doc.reviews.length;
            return rating;
        }*/
    },
    debug: true
});

const Product = mongoose.model("Product", productSchema)
Product.SyncToAlgolia();
Product.SetAlgoliaSettings({
    searchableAttributes: ["title"]
});

function validateProduct(product){
    const schema = Joi.object({
        category: Joi.string().required(),
        owner: Joi.string(),
        image: Joi.string(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        created: Joi.date()
    })
    return Joi.validate(product, schema);
}

export {validateProduct as validateProduct, Product as Product}

