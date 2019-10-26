# Serverless REST API with DynamoDB

<a href="https://aws.amazon.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png" alt="aws logo" height="100"/></a><a href="https://serverless.com"><img src="https://files.readme.io/ffb4c59-Serverless.png" alt="serverless framework logo" height="100"/></a><a href="https://www.getpostman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg" alt="postman logo" height="100"/></a>

**AWS**: Lambda, API Gateway, DynamoDB

**Serverless Framework**: Nodejs runtime

**Postman**: API testing

Built from scratch based on their [example](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb). The Serverless team created it to be a guide or proof of concept, so it's purposely bare bones. It's incredible how they have so many different types of examples up (it's at *least* 30).

I expanded on the project with following improvements/additions:
* Issue: the PUT method in update.js required both "text" and "checked" keys in request body
    * Resolution: split up endpoint from `/todos/{id}` to `/todos/{id}/text` and `/todos/{id}/checked`
    
* Issue: Get requests for an invalid or nonexistent todo ID returned status 200.
    * Resolution: now returns 403 Forbidden to hide existence of a resource from unauthorized user.
    
* Rather than forcing a certain "checked" state, I added an endpoint to toggle `/todos/{id}/tcheck`

##Set up and Usage

Same as their [project](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb). I did change the API calls so that's up next.

##API Calls

Note: `glh3x7xjak` can be replaced with your own API Gateway ID

**Create todo item**

POST request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos`

Body:<br>
`{ "text": "<your todo text>" }`

**List all todos**

GET request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos`

Body:<br>
`<none>`

**Get a todo**

GET request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>`

Body:<br>
`<none>`

**Update a todo's text**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/text`

Body:<br>
`{ "text": "<your new todo text>" }`

**Update a todo's "checked" (aka done) status**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/check`

Body:<br>
`{ "checked": true }` or `{ "checked": false }`

**Toggle a todo's "checked" (aka done) status**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/tcheck`

Body:<br>
`<none>`

**Delete a todo**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>`

Body:<br>
`<none>`

##API Testing

The Postman test collection is located in `api-tests.postman_collection.json`

You can import the file into Postman's native app or run it via command line:<br>
`newman run api-tests.postman_collection.json --folder $1.js
`
