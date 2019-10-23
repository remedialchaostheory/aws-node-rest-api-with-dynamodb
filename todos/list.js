(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  module.exports.list = (event, context, callback) => {
    dynamoDb.scan(params, (error, result) => {
      // Handle errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode,
          headers: {'Content-Type': 'text/plain'},
          body: 'Couldn\'t get todo list',
        });
        return;
      }

      // Get todo list
      const response = {
        statusCode: 200,
        body: JSON.stringify((result.Items)),
      };

      callback(null, response);
    });
  };

})();
