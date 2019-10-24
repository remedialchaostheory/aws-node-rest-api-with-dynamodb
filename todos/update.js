(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.update = (event, context, callback) => {
    const timeStamp = new Date().getTime();
    const data = JSON.parse(event.body);

    console.log('data ->', data);

    console.log('typeof data.text ->', typeof data.text);

    // Check for valid text
    if (typeof data.text !== 'string') {
      console.log('data ->', data);
      console.log('data.text ->', data.text);
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
    // Update text
    function updateText(data) {

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
        ':updatedAt': timeStamp,
      },
      UpdateExpression: 'SET #todo_text = :text, updatedAt = :updatedAt',
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

    // Update check status
    // Check for valid "check"
    if (typeof data.checked !== 'boolean') {
      console.log('data ->', data);
      console.log('data.checked ->', data.checked);
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
    // Update checked
    function updatechecked(data) {

    }

    // DynamoDB parameters
    const checked_params = {
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

    // Update item
    dynamoDb.update(checked_params, (error, result) => {
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
