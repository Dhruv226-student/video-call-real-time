const express= require('express');
const dotenv= require('dotenv');

const routes = require('./routes/index');
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

app.use("/api", routes)



// app.get('/api/auth/signup',(req,res)=>{
//     res.send("Hello from the server");
// })
// app.get('/api/auth/login',(req,res)=>{
//     res.send("Hello from the server");
// })
// app.get('/api/auth/logout',(req,res)=>{
//     res.send("Hello from the server");
// })

app.listen(PORT,()=>{
    console.log("Server is running on port 5001");
})