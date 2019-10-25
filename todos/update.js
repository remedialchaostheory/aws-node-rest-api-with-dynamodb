(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const ddbHelper = require('./ddb-helper');

  module.exports.update = (event, context, callback) => {
    const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);
    console.log('data ->', data);

    // Handle text data
    if (data.text) {
      // Check for valid text
      if (typeof data.text !== 'string') {
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Text data is not a string',
        });
        return;
      }

      // Get current text for todo item to log to lambda
      ddbHelper.getItemAttribute(event, callback, dynamoDb, 'text')
          .on('success', (response) => {
            let data = response.data.Item;
            console.log('old text ->', data.text);
          });

      // Update text
      const ddbParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
          '#todo_text': 'text',
        },
        ExpressionAttributeValues: {
          ':text': data.text,
          ':updatedAt': timeStamp,
        },
        UpdateExpression: 'SET #todo_text = :text, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
      };
      dynamoDb.update(ddbParams, (error, result) => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode,
            headers: {
              'Content-Type': 'text/plain',
            },
            body: 'Couldn\'t update text data'
          });
          return;
        }

        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Attributes),
        };
        console.log('new text ->', data.text);

        callback(null, response);
      });
    }

    // Handle checked data
    if (data.checked !== undefined) {
      // Check for valid "check"
      if (typeof data.checked !== 'boolean') {
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Checked data is not a boolean',
        });
        return;
      }

      // Update item
      let ddbParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ':checked': data.checked,
          ':updatedAt': timeStamp,
        },
        UpdateExpression: 'SET checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
      };
      dynamoDb.update(ddbParams, (error, result) => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode,
            headers: {
              'Content-Type': 'text/plain',
            },
            body: 'Couldn\'t update checked data'
          });
          return;
        }

        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Attributes),
        };

        callback(null, response);
      });
    }
  };
})();
