import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Joi from "@hapi/joi";
import config from "config";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    picture: String,
    isSeller: {type: Boolean, default: false},
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
    created: {type: Date, default: Date.now}
})

userSchema.pre("save", function(next){
    let user = this;

    if(!user.isModified("password")) return next();

    bcrypt.genSalt(config.get("saltRounds"), function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);

            user.password = hash
            return next();
        });
    });
})

/*userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password)
}*/

userSchema.methods.gravatar = function(size){
    if(!size) size = 200;
    if(!this.email) return `https://gravatar.com/avatar/?s${size}&d=retro`;
    let md5 = crypto.createHash("md5").update(this.email).digest("hex");

    return `https://gravatar.com/avatar/${md5}?s${size}&d=retro`;

}

let User = mongoose.model("User", userSchema)

function validateUser(user){
    const schema = Joi.object({
        email: Joi.string().regex(/@/).regex(/[a-z0-9]/).required(),
        name: Joi.string().alphanum().required(),
        password: Joi.string().min(8).required(),
        picture: Joi.string(),
        isSeller: Joi.bool(),
        address: {
            addr1: Joi.string(),
            addr2: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            country: Joi.string(),
            postalCode: Joi.string(),
        },
        created: Joi.date()
    });
    return Joi.validate(user, schema);
};

export {validateUser as validateUser, User as User}