const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ======================== REGISTER ========================
const authregister = async (req, res) => {
    try {
        let { name, email, mobile, password } = req.body;
        if (!name || !password || (!email && !mobile)) {
            return res.status(400).json({
                status: "failed",
                message: "name, password, and either email or mobile are required",
            });
        }
        const [existing] = await pool.query(
            "SELECT * FROM ecommerceauth WHERE email = ? OR mobile = ?",
            [email || null, mobile || null]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                status: "failed",
                message: "Email or mobile already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO ecommerceauth (name, email, mobile, password) VALUES (?, ?, ?, ?)",
            [name, email || null, mobile || null, hashedPassword]
        );

        return res.status(200).json({
            status: "success",
            message: "Registered successfully",
            user: {
                id: result.insertId,
                name,
                email: email || null,
                mobile: mobile || null,
            },
        });

    } catch (e) {
        console.error("Register error:", e.message);
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong during registration",
        });
    }
};

const authlogin = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if ((!email && !mobile) || !password) {
            return res.status(400).json({
                status: "failed",
                message: "email or mobile and password are required",
            });
        }
        const [result] = await pool.query(
            "SELECT * FROM ecommerceauth WHERE email = ? OR mobile = ?",
            [email || null, mobile || null]
        );

        if (result.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "failed",
                message: "Incorrect password",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            },
        });

    } catch (e) {
        console.error("Login error:", e.message);
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong during login",
        });
    }
};
const authchangepassword = async (req, res) => {
    try {
        const { email, mobile, password, newpassword } = req.body;

        if ((!email && !mobile) || !password || !newpassword) {
            return res.status(400).json({
                status: "failed",
                message: "email or mobile, current password, and new password are required",
            });
        }
        const [rows] = await pool.query(
            "SELECT * FROM ecommerceauth WHERE email = ? OR mobile = ?",
            [email || null, mobile || null]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "failed",
                message: "Current password is incorrect",
            });
        }

        const newHashedPassword = await bcrypt.hash(newpassword, 10);
        await pool.query("UPDATE ecommerceauth SET password = ? WHERE id = ?", [newHashedPassword, user.id]);

        return res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });

    } catch (e) {
        console.error("Change password error:", e.message);
        return res.status(500).json({
            status: "failed",
            message: "Something went wrong while changing password",
        });
    }
};

module.exports = { authregister, authlogin, authchangepassword };
