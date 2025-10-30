const pool = require("../config/db");

const addcategory = async (req, res) => {
    try {
        let { user_id, category_name } = req.body;

        if (!user_id || !category_name) {
            return res.status(400).json({
                status: "failed",
                message: "user_id and category_name are required"
            });
        }

        category_name = category_name.trim().toLowerCase(); 

 
        const [existingUser] = await pool.query(
            "SELECT * FROM ecommerceauth WHERE id = ?",
            [user_id]
        );
        if (existingUser.length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid user_id"
            });
        }
        const [categoryExisting] = await pool.query(
            "SELECT * FROM categories WHERE LOWER(TRIM(category_name)) = ?",
            [category_name]
        );
        if (categoryExisting.length > 0) {
            return res.status(400).json({
                status: "failed",
                message: "Category name already exists"
            });
        }
        const [result] = await pool.query(
            "INSERT INTO categories (category_name, user_id) VALUES (?, ?)",
            [category_name, user_id]
        );

        return res.status(200).json({
            status: "success",
            message: "Category created",
            category_id: result.insertId
        });

    } catch (e) {
        console.log("auth error is", e.message);
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        });
    }
};
const getcategories = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failed",
        message: "user_id is required"
      });
    }
    const [existing]=await pool.query("select * from  ecommerceauth where id=?",[user_id])
    if(existing.length===0){
         return res.status(200).json({
        status: "success",
        message: "invalid user_id"
      });
    }

    const [result] = await pool.query(
      "SELECT * FROM categories WHERE user_id = ?",
      [user_id]
    );


    if (result.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No categories are present"
      });
    }

    return res.status(200).json({
      status: "success",
      data: result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

const getallcategories = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failed",
        message: "user_id is required"
      });
    }
    const [existing]=await pool.query("select * from  ecommerceauth where id=?",[user_id])
    if(existing.length===0){
         return res.status(200).json({
        status: "success",
        message: "invalid user_id"
      });
    }

    const [result] = await pool.query(
      "SELECT * FROM categories" );


    if (result.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No categories are present"
      });
    }

    return res.status(200).json({
      status: "success",
      data: result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { addcategory,getcategories,getallcategories };
