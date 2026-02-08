const express = require('express');

const app = express();

// THis will only handle GET API call to /user
app.get("/user/:userID/:name", (req,res) =>{
    console.log(req.params);
    console.log(req.query);
    res.send({firtsName: "Abhishek", lastName: "sah"});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


