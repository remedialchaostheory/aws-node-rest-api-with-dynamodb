(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.DynamoDB,
  };

  module.exports.list = (event, context, callback) => {
    dynamoDb.scan(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t get todo list',
        });
      }
      return;
    });

    const response = {
      statusCode: 200,
      body: JSON.stringify((result.Items)),
    };

    callback(null, response);
  };


})();
