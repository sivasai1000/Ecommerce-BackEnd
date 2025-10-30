const express = require('express')
const dotenv=require("dotenv")
const authRoutes = require("./routes/auth_route");
const productRoutes=require("./routes/product_route")
const categoryRoutes=require("./routes/category_route")
const cors = require('cors')
const databaseconnection = require('./config/db')
const cloudinary=require("./config/cloudinary")
dotenv.config()
const port=process.env.PORT;
const app=express();
app.use(express.json());
app.use(cors({origin:"*"}));
app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use('/auth/api',authRoutes);
app.use('/api',productRoutes);
app.use('/api',categoryRoutes);
app.listen(port,()=>{
    console.log(`now server is connected to ${port}`)
})