# Serverless REST API with DynamoDB

<a href="https://aws.amazon.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png" alt="aws logo" height="100"/></a><a href="https://serverless.com"><img src="https://files.readme.io/ffb4c59-Serverless.png" alt="serverless framework logo" height="100"/></a><a href="https://www.getpostman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg" alt="postman logo" height="100"/></a>

**AWS**: Lambda, API Gateway, DynamoDB

**Serverless Framework**: Nodejs runtime, CloudFormation

**Postman**: API testing

Built from scratch based on their [example](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb). The Serverless team created it to be a guide or proof of concept, so it's purposely bare bones. It's still incredible how they have so many different types of examples up for the framework(it's at *least* 30).

## Improvements/Additions

* Issue: the PUT method in update.js required both "text" and "checked" keys in request body
    * Resolution: split up endpoint from `/todos/{id}` to `/todos/{id}/text` and `/todos/{id}/checked`<br>
    
* Issue: Get requests for an invalid or nonexistent todo ID returned status 200.
    * Resolution: now returns 403 Forbidden to hide existence of a resource from unauthorized user.<br>
    
* Rather than forcing a certain "checked" state, I added an endpoint to toggle it `/todos/{id}/tcheck`

* Refactored DynamoDB calls into a helper function to get the todo item's original data before being overwritten (for logging and potential history purposes)

## Setup and Usage

Please refer to their [original project](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb). I changed a few of the API calls, so I'll give you a complete list next.

## API Calls<br>
Note: `glh3x7xjak` will be replaced with your own API Gateway ID. I left mine in for you to test it out.

**Create todo item**

POST request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos`

Data:<br>
`{ "text": "<your todo>" }`

**List all todos**

GET request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos`

Data:<br>
`<none>`

**Get a todo**

GET request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>`

Data:<br>
`<none>`

**Update a todo's text**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/text`

Data:<br>
`{ "text": "<your new todo text>" }`

**Update a todo's "checked" (aka done) status**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/check`

Data:<br>
`{ "checked": true }` or `{ "checked": false }`

**Toggle a todo's "checked" (aka done) status**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>/tcheck`

Data:<br>
`<none>`

**Delete a todo**

PUT request:<br>
`https://glh3x7xjak.execute-api.us-east-1.amazonaws.com/dev/todos/<id>`

Data:<br>
`<none>`

## API Testing

The Postman test collection is located in `api-tests.postman_collection.json`

You can import the file into Postman's native app or run it via command line:<br>
`newman run api-tests.postman_collection.json` (This will run all tests)

One thing to note is that within a Postman test collection, there are folders that can contain requests.
Within those requests are the tests.<br>
E.g: `Collection > Folder > Request > Test(s)`

Each API call has its own JavaScript file in `/todos`. Test requests are grouped into folders according to that filename.<br>
E.g: `api-tests.postman_collection.json > create.js > Requests > Test(s)`

To run a test for a specific API call/JavaScript file from the command line, enter:<br>
`newman run api-tests.postman_collection.json --folder <collection folder name>.js`

For example, if you wanted to run all the tests for `create.js`:<br>
`newman run api-tests.postman_collection.json --folder create.js`<br>
Note: The collection folder&mdash;in this case, `create.js`&mdash;can be named anything. I just decided to keep it the same as the file name for clarity.

All tests can be run in isolation. Each has a pre-request script that are invoked to set up environment variables (e.g. id, text data, etc).

## Automate Deployment and Testing

Tests will generate a *random verb* and *random noun* to send the body of the request for creating/updating todo items.
For example, to test an update call to the API, it will send something like `{ "text": "navigate pixel" }` or `{ "text": "synthesize monitor" }`, which I thought was fun.

I included a simple bash script that will deploy a Lambda function (JavaScript file) and then run the associated tests.<br>
`./deploy-and-test-function.sh <javascript file>` (do not include the `.js` extension)<br>

For example, if you made changes to `create.js` and wanted to deploy that Lambda function to AWS and immediately run tests:
`./deploy-and-test-function.sh create`<br>
If you get a permissions error, type `chmod 0755 deploy-and-test-function.sh` to allow anyone to execute the script.

Only takes 1 positional argument (as of this writing). Either plan to use a for loop or flag arguments. I never needed to deploy and test more than one at a time so it wasn't needed.

*Remember*: If you made any changes to the `serverless.yml` file, those changes won't be included when you use the deploy function method. You need to run a full `sls deploy -v` instead. Refer back to the original [project](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) for more info.

