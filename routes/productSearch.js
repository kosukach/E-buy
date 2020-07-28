import express from "express";
import algoliasearch from "algoliasearch";

const router = express.Router();
const client = algoliasearch("B7H58PYGWD", "16d97ea5bbe5915190ef3059f4be5dd7") 
const index = client.initIndex('e-buy1');

router.get("/", (req, res, next)=>{
    if(req.query.query){
        index.search(req.query.query, {
            query: req.query.query,
            page: req.query.page
        })
        .then((content)=> {
            res.status(200).json({
                success: true,
                message: "voila",
                content: content,
                search_result: req.query.query
            })
        })
        .catch(err => {
            console.log(err);
        });
    }else{
        res.status(400).json({
            success: false,
            message: "No query provided"
        })

    }
});

export default router;