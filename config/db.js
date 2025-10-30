const mysql=require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config();
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME

});
pool.getConnection().then((conn)=>{
    console.log(`database is connected to : ${process.env.DB_NAME}`)
    conn.release();
}).catch((e)=>{
    console.error("MySQL connection failed:", e.message);
        process.exit(1);
})
module.exports = pool;

