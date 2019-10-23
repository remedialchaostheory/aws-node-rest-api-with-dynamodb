(function () {
  'use strict';

  const uuid = require('uuid');
  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    console.log('data', data);

    if (typeof data.text !== 'string') {
      console.error('Invalid data');
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create todo item'
      });
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        text: data.text,
        checked: false,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    dynamoDb.put(params, (error) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create todo item',
        });
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };

      callback(null, response);
    });

    return;
  };

})();
