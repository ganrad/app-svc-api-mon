const https = require('https');
const fs = require('fs');

module.exports = async function () { // context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    /* if(myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    };*/
    // context.log("Executing API...");

    var urlobj = JSON.parse(fs.readFileSync('./config/check_urls.json','utf8'));
    // console.log(urlobj);
    var items = urlobj.length;
    console.log("No. of API collections:" + items);

    for ( var i=0; i < items; i++ ) {
    	console.log("Invoking API=" + urlobj[i].collection);
    	https.get(urlobj[i].url, (resp) => {
        	let data = '';

        	// A chunk of data has been recieved.
        	resp.on('data', (chunk) => {
            		data += chunk;
        	});

        	// The whole response has been received. Print out the result.
        	resp.on('end', () => {
            		// context.log(data);
            		console.log("Response: " + data);
        	});
    	}).on("error", (err) => {
        	console.log("Error: " + err.message);
    	});
    }; // end of for loop
    // context.log('JavaScript timer trigger function ran!', timeStamp);   
    console.log('JavaScript timer trigger function ran!', timeStamp);   
};
