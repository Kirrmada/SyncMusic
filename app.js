const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");

const app = express();

app.use(express.static("public"));  /* for apply static files like css or images */
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

/*
app.get("/", function(req,res){
    res.sendFile('index1.html');
}); */

app.post("/", function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/b2ae2c2db7";

    const options = {
        method: "POST",
        auth: "zeel:04c4fdbedf02cff7977d357a40b7177f-us17"
    }

    const request = https.request(url,options,function(response){
       
       if(response.statusCode === 200){
           res.sendFile(__dirname + "/index.html");
       }
       else{
           res.sendFile(__dirname + "/failure.html");
       }
       
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});



app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function(){
    console.log("server is running on 3000")
});