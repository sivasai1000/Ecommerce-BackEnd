const express=require("express");
const {authregister,authlogin,authchangepassword}=require('../controllers/auth-controller')
const routes = express.Router();

routes.post('/register',authregister);
routes.post('/login',authlogin)
routes.post('/changepassword',authchangepassword)

module.exports = routes;