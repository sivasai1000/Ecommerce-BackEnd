
const express = require("express");
const router = express.Router();
const { addproduct,getproduct,getproductbycategory,getproductbyid,deleteproduct,updateproduct } = require("../controllers/products_controller");
const { upload } = require("../config/cloudinary");

router.post("/addproduct", upload.single("product_img"), addproduct);
router.post("/getproduct",getproduct);
router.post("/getproductbycategory/:category_id",getproductbycategory);
router.post("/getproductbyid/:id",getproductbyid);
router.post("/deleteproduct",deleteproduct);
router.post("/updateproduct",upload.single("product_img"),updateproduct);

module.exports = router;
