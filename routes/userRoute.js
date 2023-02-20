const express = require("express")
const userRoute = express.Router()
const { UserModel } = require("../models/userModel")
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
require("dotenv").config()


userRoute.get("/", async (req, res) => {
    const data = await UserModel.find()
    res.send(data)
})



userRoute.post("/register", async (req, res) => {
    try {
        const { name, email, gender, password, age, city } = req.body;
        const database = await UserModel.find({email})
        console.log(database);
        if (database.length>0) {
            res.send({ "msg": "User already exist, please login" })
        } else {
            bcrypt.hash(password, 7, async (err, hash) => {
                if (err) {
                    res.send("somethig went wrong")
                } else {
                    const data = new UserModel({ name, email, gender, password: hash, age, city })
                    await data.save()
                    res.send({ "msg": "register successful" })
                }
            });
        }

    } catch (error) {
        res.send({ "msg": "somethig went wrong", "error": error.message })

    }
})


userRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const database = await UserModel.find({ email })
        if (database.length > 0) {
            bcrypt.compare(password, database[0].password).then( (result) =>{
                if(result){
                    var token = jwt.sign({ userid:database[0]._id }, process.env.key);
                    res.send({"msg":"login successful","token":token})
                }else{
                    res.send({ "msg": "wrong credential" })
                }
            });
        } else {
            res.send({ "msg": "wrong credential" })
        }

    } catch (error) {
        console.log(error);

    }
})
module.exports = { userRoute }