const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req,res){
  const today = new Date();
  
  const options ={
    weekday: "long",
    day: "numeric",
    month:"long",
    year:"numeric"
  };

  const onlyYear ={
    year:"numeric"
  };
   
  const day = today.toLocaleDateString("en-US", options);
  const year = today.toLocaleDateString("en-US", onlyYear);
  

  res.render("home", {kindOfDay:day, year:year});
});


app.get("/newsletter", function(req,res){
  const today = new Date();
  const onlyYear ={
    year:"numeric"
  };   
  const year = today.toLocaleDateString("en-US", onlyYear);

  res.render("newsletter",{year:year});
});

app.post("/newsletter", function(req,res){
  var firstName = req.body.firstName;
  var lastName= req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

 // then we use JSON.stringify to stringify var data
 var jasonData = JSON.stringify(data);

  var options ={
    // url link and example below was gotten from https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Code_examples, u hav to change some things in it
    url: 'https://us4.api.mailchimp.com/3.0/lists/270136c814',
    method: 'POST',
    // for Authentication credentials or Authorization for Mailchimp server or any API, we use below func
    headers: {
      "Authorization": "tim1 babf8e70dffe1952c30ca25dfb188729-us4"
    },
    body: jasonData
  };

  // we use the below Express request style/fucn to connect with Mailchimp API
  request(options,function(error,response,body){
    if(error){
      console.log(error);
      res.sendFile(__dirname + '/failure.html');
    }else{
      if(response.statusCode ===200){
        console.log(response.statusCode);
        res.sendFile(__dirname + '/success.html');
      }
      else{
        res.sendFile(__dirname + '/failure.html');
      }

    }
  });

   //console.log(req.body); // prints our all submitted form data in the entire web page in a JS BOJECT Format
  // But
  console.log(firstName,lastName,email); // only prints out specific infos and data in a specific form
  // res.sendFile(__dirname + '/success.html');
});


//for heroku or any hosting server to recognize our server 3000, we ought to add process.env to port 3000, see below func
//app dot listen section
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;}

app.listen(port, function() {
  console.log("Server have started Successfully.");
});
