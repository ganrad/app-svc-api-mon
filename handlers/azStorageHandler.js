const {
    Aborter,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadStreamToBlockBlob,
    uploadFileToBlockBlob
} = require('@azure/storage-blob');

const fs = require("fs");
// const path = require("path");

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

function AzStorageHandler() {
}

AzStorageHandler.prototype = {
	showContainerNames: async function(aborter, serviceURL) {
		let response;
		let marker;

		do {
			response = await serviceURL.listContainersSegment(aborter, marker);
			marker = response.marker;
			for(let container of response.containerItems) {
			    console.log(` - ${ container.name }`);
			}
		} while (marker);
	},

	uploadException: async function(apiCollName, payload) {
		const containerName = STORAGE_CONTAINER_NAME;
		const blobName = apiCollName + ".json";
		const content = JSON.stringify(payload);
		// const localFilePath = "./"; 

		console.log("Storage account name:" + STORAGE_ACCOUNT_NAME);
		console.log("Container name:" + containerName);
		console.log("Blob name:" + blobName);
		console.log("Exception Payload:" + content);

		const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
		const pipeline = StorageURL.newPipeline(credentials);
		const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
	    
		const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
		const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
	    
		const aborter = Aborter.timeout(2 * ONE_MINUTE); // two minute timeout

		// console.log("Listing Storage Containers:");
		// await this.showContainerNames(aborter, serviceURL);

		await blockBlobURL.upload(aborter, content, content.length);
		console.log(`Blob "${blobName}" is uploaded`);
	}
}

module.exports = AzStorageHandler;
