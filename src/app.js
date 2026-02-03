const express = require('express');

const app = express();

app.use("/test",(req,res) =>{
    res.send("Hi from the server");
});

app.use("/hello",(req,res) =>{
    res.send("hello hello hello the server");
});

app.use("/",(req,res) =>{
    res.send("Hi from the dashboard of dev tinder");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


