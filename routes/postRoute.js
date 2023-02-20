const express = require("express")
const { PostModel } = require("../models/postModel")
const postRouter = express.Router()

postRouter.get("/", async (req, res) => {
    try {
        let obj = {}
        const device = req.query.device
        if (device) {
            obj.device = device
        }

        obj.user = req.body.user
        const post = await PostModel.find(obj)
        const count=await PostModel.find(obj).countDocuments()
        res.send({"posts":post,count:count})

    } catch (error) {
        res.send({ "msg": "SOmwthing Went wrong", "error": error.message })
    }
})

postRouter.post("/create", async (req, res) => {
    try {

        const bodyData = req.body;
        let data = new PostModel(bodyData)
        await data.save();
        res.send({ "msg": "post creation successful" })
    } catch (error) {
        res.send({ "msg": "something went wrong", "error": error.message })

    }
})
postRouter.patch("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const post = await PostModel.findOne({ "_id": id })
        const userid = post.user;
        const userid_req = body.user;
        if (userid !== userid_req) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await PostModel.findByIdAndUpdate({ "_id": id }, body)
            res.send({ "msg": `post with id:${id} has been update` })
        }
    } catch (error) {
        res.send({ "msg": "something went wrong", "error": error.message })

    }
})



postRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    const data = req.body
    const post = await PostModel.findOne({ "_id": id })
    const userID_in_note = post.user
    const userID_making_req = req.body.user

    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await PostModel.findByIdAndDelete({ "_id": id })
            res.send({ "msg": `Note with id:${id} has been delete` })
        }
    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong" })
    }

})

postRouter.get("/top", async (req, res) => {
    try {
        const data= await PostModel.find({user:req.body.user,$max:"$no_of_comment"})
        console.log(data
            );
            res.send(data)
    } catch (error) {
        res.send({ "msg": "something went wrong", "error": error.message })

    }
})
module.exports = {
    postRouter
}