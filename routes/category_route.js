const express=require("express");
const {addcategory,getcategories,getallcategories} = require('../controllers/category-controller')
const routes = express.Router();

routes.post('/addcategory',addcategory);
routes.post('/getcategorybyuserid',getcategories);
routes.post('/getcategory',getallcategories);



module.exports = routes;