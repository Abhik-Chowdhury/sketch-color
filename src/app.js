const express = require('express')
const path =  require('path')
const app = express();
const port = process.env.PORT || 8000

const static_path = path.join(__dirname,'../public')
console.log(`${static_path}`)

app.use(express.static(static_path))

app.get("",(req,res)=>{
    res.send("Welcome")
})

app.listen(port,()=>{
    console.log(`lisiting ${port}`)
})