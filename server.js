//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(function(req, res) {
  //res.status(404).send({url: req.originalUrl + ' not found'});
  //next();
//});


// middleware to use for all requests
// router.use(function(req, res, next) {
    // // do logging
    // console.log('Something is happening.');
    // next(); // make sure we go to the next routes and don't stop here
// });

var routes = require('./routes/postmanRoutes'); //importing route
routes(app); //register the route


app.listen(port);

console.log('New Postman Rest Api server started on: ' + port)