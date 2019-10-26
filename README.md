# Serverless REST API with DynamoDB

<a href="https://aws.amazon.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png" alt="aws logo" height="100"/></a><a href="https://serverless.com"><img src="https://files.readme.io/ffb4c59-Serverless.png" alt="serverless framework logo" height="100"/></a><a href="https://www.getpostman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg" alt="postman logo" height="100"/></a>

**AWS**: Lambda, API Gateway, DynamoDB

**Serverless Framework**: Nodejs runtime

**Postman**: API testing

Based on their [example](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) but with the following improvements/additions:
* Issue: the PUT method in update.js required both "text" and "checked" keys in request body
    * Resolution: split up endpoint from `/todos/{id}` to `/todos/{id}/text` and `/todos/{id}/checked`
    
* Issue: Get requests for an invalid or nonexistent todo ID returned status 200.
    * Resolution: now returns 403 Forbidden to hide existence of a resource from unauthorized user.
    
* Rather than forcing a certain "checked" state, I added an endpoint to toggle `/todos/{id}/tcheck`

