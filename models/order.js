import mongoose from "mongoose";
import DeepPopulate from "mongoose-deep-populate";

const deepPopulate = new DeepPopulate(mongoose);

const OrderSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalPrice: { type: Number, default: 0 },
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        quantity: {type: Number, default: 1}
    }]
});


OrderSchema.plugin(deepPopulate);

const Order = mongoose.model("Order", OrderSchema)
export {Order as Order};