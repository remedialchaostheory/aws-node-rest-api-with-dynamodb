# Serverless REST API with DynamoDB

Built with [Serverless Framework](https://serverless.com/) for faster deployments and AWS. 

Based on their [example](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) but with the following improvements/additions:
* Issue: the PUT method in update.js required both "text" and "checked" keys in request body
    * Resolution: split up endpoint from `/todos/{id}` to `/todos/{id}/text` and `/todos/{id}/checked`
    
* Issue: Get requests for an invalid or nonexistent todo ID returned status 200.
    * Resolution: now returns 403 Forbidden to hide existence of a resource from unauthorized user.
    
* Rather than forcing a certain "checked" state, I added an endpoint to toggle `/todos/{id}/tcheck`

