const express = require("express") ;
const router = express.Router() ;


//index route
router.get("/",(req,res)=>{
    res.send("GET for user") ;
})

//Show
router.get("/:id",(req,res)=>{
    res.send("GET for user id") ;
})

//POST
router.post("/",(req,res)=>{
    res.send("POST for user") ;
})

//DELETE
router.delete("/:id",(req,res)=>{
    res.send("DELETE for user") ;
}) ;

module.exports = router ;