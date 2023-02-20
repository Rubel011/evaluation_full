const express= require("express");
const app= express()
const cors=require("cors")
const{userRoute}=require("./routes/userRoute")
const {connection}=require("./db");
const { postRouter } = require("./routes/postRoute");
const { authenticate } = require("./middleware/authenticate");
app.use(cors())
app.use(express.json())


app.use("/users",userRoute)
app.get("/",(req,res)=>{
    res.send("Home page");
})
app.use(authenticate)
app.use("/posts",postRouter)
app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log({"msg":`server is running at port ${process.env.port}`});
        
    } catch (error) {
        console.log("somethig went wrong");
        
    }
})