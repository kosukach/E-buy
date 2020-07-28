import multer from "multer";
import path from "path";
import { nextTick } from "process";

const storage = multer.diskStorage(
    {
        destination: "C:/Users/User/Documents/e-buy/client/AngularEbuy/src/assets/images",
        filename: function(req, file, cb){
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
        }   
    }
)

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFiletype(file, cb)
    }
}).single("product_picture");

function checkFiletype(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true)
    }
    cb("Error: Images only!")
}

function uploadMiddleware(req, res, next){
    
    upload(req, res, (error)=>{
        if(error){
            res.json({
                success: false,
                message: error["message"]
            })
        }
        if(req.file == undefined){
            res.json({
                success: false,
                message: "Please select file"
            })
        }
        next()
    })
    
}

export default uploadMiddleware;