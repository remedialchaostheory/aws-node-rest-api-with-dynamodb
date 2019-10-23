(function () {
  'use strict';

  const AWS = require('aws-sdk');

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.get = (event, context, callback) => {

    console.error('event', event);

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

      // Response
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };

      callback(null, response);
    });
  };

})();
