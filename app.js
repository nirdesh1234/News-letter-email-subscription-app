const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url =
    "https://us21.api.mailchimp.com/3.0/lists/2bbc2e1742";   //endpoint/lists/list-id as in the documentation
  const options = {
    method: "POST",
    auth: "nirdesh:0b7c700ea876905799432a6e2a089bab-us21",  // anystring:password(as mentioned in the site )
  };

  const request = https.request(url, options, function (response) {    //store the instance of object got from the request

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{res.sendFile(__dirname + "/failure.html");}
   

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);    //declared outside because it is used to send data to the server whereas the above is receiving data from the server
  request.end();
});

app.post("/failure", function (req, res){
  res.redirect("/");
});




app.listen(process.env.PORT || 3000 , function () {                               //process.env.port allows port to be specified by heroku - Dynamic port
  console.log("Server is running on port 3000.");
});


// 2bbc2e1742. id
// 0b7c700ea876905799432a6e2a089bab-us21 api key