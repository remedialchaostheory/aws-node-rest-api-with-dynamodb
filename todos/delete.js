(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.delete = (event, context, callback) => {
    // Delete item
    const ddbParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };
    dynamoDb.delete(ddbParams, (error) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t remove the todo item.',
        });
        return;
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify({}),
      };
      callback(null, response);
    });
  };
})();
