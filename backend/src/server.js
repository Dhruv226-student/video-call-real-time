const express= require('express');
const dotenv= require('dotenv');

const routes = require('./routes/index');
const connectDB = require('./db/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow frontend to access cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

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
    connectDB();
})