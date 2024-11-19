require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
require('./DB/connectDB');
const app = express();
const PORT  = process.env.PORT || 3000;
const authRoutes = require('./Routes/auth.route');


app.use(cors({
    origin : "http://localhost:5173", credentials : true
}))

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // allows us to parse incoming cookies

app.use('/api/auth', authRoutes);


app.listen(PORT,() => {
    console.log(`server is running on Port 3000`)
})