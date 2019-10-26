(function () {
  'use strict';

  const AWS = require('aws-sdk');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.get = (event, context, callback) => {

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };

    dynamoDb.get(params, (error, result) => {
      // Handle errors
      if (error) {
       console.error(error);
       callback(null, {
         statusCode: error.statusCode,
         headers: { 'Content-Type': 'text/plain' },
         body: 'Couldn\'t retrieve todo item',
       });
       return;
      }

      // Handle invalid or nonexistent item
      let response;
      if (!result.Item) {
        console.error('result.Item invalid ->', result.Item);
        response = {
          statusCode: 403,
          body: '403 error',
        };
      } else {
        response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
      }

      callback(null, response);
    });
  };

})();
