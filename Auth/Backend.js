const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const router = require('./routes/User_router')
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const cors = require('cors')



app.use(cors({credentials:true, origin:'http://localhost:3000'})) 
app.use(express.json());
app.use(cookieparser())
app.use('/api', router);

mongoose.connect(`mongodb+srv://dashboard:dashboard@cluster0.we74x89.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
    console.log('connected to database');
}).catch((err) => {
    console.log(err.message,'error occured while connecting');
})
