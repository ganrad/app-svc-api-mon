'use strict';

var newman = require('newman');

var AzureStorageHandler = require('./../handlers/azStorageHandler.js');

var errCount = [{ collection: "Collection Name:Environment Name", ecount: "Failure count",
	retries: "Retries attempted", timestamp: "Time (ms) when first failure occurred" }];
var retryCount = process.env.API_RETRY_COUNT || 5; // Minimum number of failure attempts
var failureInterval = (process.env.API_FAILURE_INTERVAL || 15) * 60 * 1000; // Failure interval in milli-seconds

exports.run = async function(req, res) {

   var col = './postman/' + req.query.col;
   var env = './postman/' + req.query.env;
   await newman.run({
     collection: col,
     reporters: ['cli'],
     bail : ['folder','failure'],
     insecure: true,
     timeoutRequest: 5000, // wait 5 seconds for API call to finish or else timeout
     environment: env
     }).on('start', function (err, args) { // on start of run, log to console
     	console.log('running a collection...');
     }).on('exception', function (err, args) { // on start of run, log to console
    	console.log('ddddd...');
     }).on('done', function (err, summary) {
	var pcol = req.query.col;
	pcol = pcol.substring(0,pcol.indexOf(".postman"));
	var pcolenv = req.query.env;
	pcolenv = pcolenv.substring(0, pcolenv.indexOf(".postman"));
	
	var colenv = pcol + ":" + pcolenv;
	var ecArrLength = errCount.length;
	var found = false;
	var element = null;
	for (var errIdx=0; errIdx < ecArrLength; errIdx++) {
		element = errCount[errIdx];
		if ( element.collection == colenv ) {
			element.ecount++;
			element.retries++;
			found = true;
			break;
		};
	};

     if (err || summary.error) {
        console.error('Collection run [' + colenv + '] encountered an error.');

	if ( ! found ) {
	   var ctime = new Date();
	   element = {collection: colenv, ecount: 1 , retries: 1, timestamp: ctime.getTime()};
	   errCount[errCount.length] = element;
	};
	console.log("Failure Count Array:");
   	console.log(errCount);
	if ( retryCount <= element.ecount ) {
	   element.ecount = 0; // reset the api error count to zero!

	   var ctime = new Date().getTime();
	   if ( (ctime - element.timestamp) > failureInterval ) {
		   // Store the error json object as a blob in Azure Storage
		   var errPayload = {
		     "error": err,
		     "retry-attempts": element.retries,
		     "failure": summary.error,
		     "collection": pcol,
		     "environment": pcolenv,
		     "api": "Unavailable",
		     "operation" : "GET"
		   };
		   console.log("Failure Object:");
		   console.log(errPayload);
		   element.retries = 0;

		   var azStorHandler = new AzureStorageHandler();
		   var time = new Date();
		   var timeSuffix = time.getMonth() + "-" + time.getDate() + "-" + time.getFullYear() + "_" + time.getHours() + "-" + time.getMinutes() + "-" + time.getSeconds();

		   var blobFileName = pcol + "-" + pcolenv + "_" + timeSuffix;
		   azStorHandler.uploadException(blobFileName,errPayload).then(() => console.log("Done")).catch((e) => console.log(e));

		   element.timestamp = new Date().getTime();
	   };
	};
	//res.send(err);
	res.status(500).json(err);
     }
     else {
        console.log('collection run completed.');
	if ( found )
	   errCount.splice(errIdx,1);
	res.json('Collection run completed.');
     }
   });

};
