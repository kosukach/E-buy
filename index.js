  
import express from "express"
import "express-async-errors"
import mongoose from "mongoose"
import config from "config"
import cors from "cors"
import accountRoutes from "./routes/account.js"
import addressRoutes from "./routes/address.js";
import profileRoutes from "./routes/profile.js";
import orderRoutes from "./routes/orders.js";
import mainRoutes from "./routes/main.js"
import sellerRoutes from "./routes/seller.js"
import productSearchRoutes from "./routes/productSearch.js";
import path from "path"

const app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.static("./client"));
app.use(cors());
app.use("/api", mainRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/accounts", addressRoutes);
app.use("/api/accounts", orderRoutes);
app.use("/app/accounts", profileRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/search", productSearchRoutes);

mongoose.connect(process.env.MONGODB_URI ||config.get("db"), { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${config.get("db")}...`))
  .catch((ex)=> console.log(ex));

let port = process.env.PORT || config.get("port");
app.listen(port, ()=> {console.log(`listening on port ${port}...`)})

if(process.env.NODE_ENV == "production"){
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'dist', 'index.html'));
  });  
}
//HEROKU CODE
