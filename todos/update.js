(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.update = (event, context, callback) => {
    const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // Handle error
    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
      console.error('Invalid data');
      callback(null, {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Couldn\'t update todo item',
      });
      return;
    }

    // DynamoDB parameters
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
      ExpressionAttributeNames: {
        '#todo_text': 'text',
      },
      ExpressionAttributeValues: {
        ':text': data.text,
        ':checked': data.checked,
        ':updatedAt': timeStamp,
      },
      UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW',
    };

    // Update item
    dynamoDb.update(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode,
          headers: {
            'Content-Type': 'text/plain',
          },
          body: 'Couldn\'t retrieve todo item'
        });
        return;
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
      };

      callback(null, response);
    });

  };

})();
