const express = require("express");
const { Router } = require("express");
const jwt = require("jwt")
const User = require("../models/user")
const ExpressError = require("../expressError")
const SECRET_KEY = require("../config")

const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async function (req,res, next){
    try{
    const {username, password } = req.body;
        if(await User.authenticate(username, password) === True){
            return res.json({msg: "login successsful"})
        }
    throw new ExpressError("Invalid user/password", 400);       
    } catch(e){
        return next(e)
    }       
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async function(req,res,next){
    try{
        const {username, password, first_name, last_name, phone} = req.body;
        const user = User.resigter(username, password, first_name, last_name, phone)
        if(User.authenticate(username, password) === true){
        let token = jwt.sign({username}, SECRET_KEY);
        return res.json({ token })
    }
     throw new ExpressError("Authentication Failed", 400);
     } catch(e) {
        next(e)
     }
})