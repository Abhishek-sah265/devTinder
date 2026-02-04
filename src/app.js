const express = require('express');

const app = express();

// THis will only handle GET API call to /user
app.get("/user", (req,res) =>{
    res.send({firtsName: "Abhishek", lastName: "sah"});
});

app.post("/user", (req,res) =>{ 
    res.send({message: "Data is saved successfully"});
});

app.delete("/user", (req,res) =>{
    res.send({message: "Data is deleted successfully"});    
});
//This will match all the HTTP Methods(GET, POST, PUT, DELETE) API call to /test
app.use("/test",(req,res) =>{
    res.send("Hi from the server");
});

// app.use("/hello",(req,res) =>{
//     res.send("hello hello hello the server");
// });

// app.use("/",(req,res) =>{
//     res.send("Hi from the dashboard of dev tinder");
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


