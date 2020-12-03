const mongoose=require("mongoose")

const url="mongodb://localhost:27017/project"

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db=mongoose.connection

module.exports=db