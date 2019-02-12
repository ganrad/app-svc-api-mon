# app-svc-api-mon

Configure the following environment variables.

Environment Variable | Default Value | Description
-------------------- | ------------- | ------------
API_RETRY_COUNT | 5 | Minimum no. of API call failures required to trigger alert
API_FAILURE_INTERVAL | 15 | Time (in minutes) the API has to be down in order to trigger alert
AZURE_STORAGE_ACCOUNT_NAME | None (Specify value) | Azure storage account name
AZURE_STORAGE_ACCOUNT_ACCESS_KEY | None (Specify value) | Azure storage account access key
AZURE_STORAGE_CONTAINER_NAME | None (Specify value) | Azure Storage container name
