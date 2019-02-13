var driver = require("./index.js");

async function invoke_driver() {
	await driver();
}

invoke_driver().then(console.log("--End--"));
