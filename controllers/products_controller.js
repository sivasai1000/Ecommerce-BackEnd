const cloudinary = require("../config/cloudinary");
const pool = require("../config/db");


const addproduct = async (req, res) => {
    try {
        let { user_id, category_id, product_name, product_desc, product_mrp } = req.body
        const product_img = req.file?.path;
        if (!product_name || !product_desc || !product_mrp || !user_id || !category_id) {
            return res.status(400).json({
                status: "failed",
                message: "fileds are required",
            })
        }
        const [result] = await pool.query("insert into ecommerceproducts (user_id,category_id ,product_name,product_desc,product_mrp,product_img) values (?,?,?,?,?,?)", [user_id, category_id, product_name, product_desc, product_mrp, product_img])
        return res.status(200).json({
            status: "success",
            message: "product added success",
            product_id: result.insertId
        })
    } catch (e) {
        console.log("auth error is ", e.message)
        return res.status(404).json({
            status: "failed",
            message: "something went wrong"

        })
    }
}

const getproduct = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({
                status: "failed",
                message: "user_id is required",
            });
        }

        const [result] = await pool.query(
            `SELECT p.*, c.category_name 
             FROM ecommerceproducts p
             JOIN categories c ON p.category_id = c.category_id
             WHERE p.user_id = ?`,
            [user_id]
        );

        if (result.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "all products retrieved successfully",
                user_id: user_id,
                data: result,
            });
        } else {
            return res.status(400).json({
                status: "failed",
                message: "No products found for this user_id",
            });
        }

    } catch (e) {
        console.error("auth error is", e.message);
        return res.status(500).json({
            status: "failed",
            message: "something went wrong",
        });
    }
};
const getallproduct = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({
                status: "failed",
                message: "user_id is required",
            });
        }

        const [result] = await pool.query(
            `SELECT p.*, c.category_name 
             FROM ecommerceproducts p
             JOIN categories c ON p.category_id = c.category_id
             `,
            
        );

        if (result.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "all products retrieved successfully",
                user_id: user_id,
                data: result,
            });
        } else {
            return res.status(400).json({
                status: "failed",
                message: "No products found for this user_id",
            });
        }

    } catch (e) {
        console.error("auth error is", e.message);
        return res.status(500).json({
            status: "failed",
            message: "something went wrong",
        });
    }
};
const getproductbycategory = async(req,res)=>{
    try{
    let {category_id}=req.params;
    let {user_id}=req.body;
    if (!user_id || !category_id) {
            return res.status(400).json({
                status: "failed",
                message: "user_id and category_id is required",
            })
        }
        const [result] = await pool.query("select * from ecommerceproducts where user_id=? and category_id=?",[user_id,category_id]);
         if (result.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "all product are get by the category",   
                data: result
            })

        } else {
            return res.status(400).json({
                status: "failed",
                message: "No products found for this category and user"
            })
        }
          } catch (e) {
        console.log("auth error is ", e.message)
        return res.status(404).json({
            status: "failed",
            message: "something went wrong"

        })
    }
}
const updateproduct = async (req, res) => {
  try {
    const { product_id, user_id, category_id, product_name, product_desc, product_mrp } = req.body;
    const product_img = req.file?.path; // multer-storage-cloudinary gives this URL directly

    if (!user_id || !product_id) {
      return res.status(400).json({
        status: "failed",
        message: "user_id and product_id are required",
      });
    }

    const fields = [];
    const values = [];

    if (product_name) fields.push("product_name = ?"), values.push(product_name);
    if (product_desc) fields.push("product_desc = ?"), values.push(product_desc);
    if (product_mrp) fields.push("product_mrp = ?"), values.push(product_mrp);
    if (category_id) fields.push("category_id = ?"), values.push(category_id);
    if (product_img) fields.push("product_img = ?"), values.push(product_img);

    if (fields.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No fields provided to update",
      });
    }

    values.push(product_id, user_id);

    const [result] = await pool.query(
      `UPDATE ecommerceproducts SET ${fields.join(", ")} WHERE product_id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found or not updated",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
    });
  } catch (e) {
    console.error("Update product error:", e);
    res.status(500).json({
      status: "failed",
      message: e.message || "Something went wrong",
    });
  }
};



const getproductbyid = async(req,res)=>{
    try{
        let {id}=req.params;
        let {user_id}=req.body;
        if (!user_id || !id) {
            return res.status(400).json({
                status: "failed",
                message: "user_id and product_id is required",
            })
        }
        const [result] = await pool.query("select * from ecommerceproducts where user_id=? and product_id=?",[user_id,id]);
        const data =result[0]
         if (result.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "all product are get by the id", 
                product_id:data.product_id ,
                result
            })

        } else {
            return res.status(400).json({
                status: "failed",
                message: "No products found for this user"
            })
        }


    }catch (e) {
        console.log("auth error is ", e.message)
        return res.status(404).json({
            status: "failed",
            message: "something went wrong"

        })
    }
}
const deleteproduct = async(req,res)=>{
    try{
        let {user_id,product_id}=req.body;
         if (!user_id || !product_id) {
            return res.status(400).json({
                status: "failed",
                message: "user_id and product_id is required",
            })
        }
         const [result] = await pool.query("delete from ecommerceproducts where user_id=? and product_id=?",[user_id,product_id]);
         if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "success",
                message: "product is deleted",   
               
            })

        } else {
            return res.status(400).json({
                status: "failed",
                message: "No products found for this user"
            })
        }



    }catch (e) {
        console.log("auth error is ", e.message)
        return res.status(404).json({
            status: "failed",
            message: "something went wrong"

        })
    }
}


module.exports = { addproduct, getproduct,getproductbycategory,getproductbyid,deleteproduct ,updateproduct,getallproduct}