(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const ddbHelper = require('./ddb-helper.js');

  module.exports.toggleCheck = (event, context, callback) => {
    const eventData = JSON.parse(event.body);

    function toggleCheckStatus(data, callback) {
      const timeStamp = new Date().getTime();

      // DynamoDB parameters
      const params = {
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

      // Update check status
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

    }

    // Check for empty data
    if (eventData.checked === '' || eventData.checked === null || eventData.checked === undefined) {
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain', },
        body: 'No event data'
      });
      return;
    }

    // Check for valid data type
    if (typeof eventData.checked !== 'boolean') {
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Invalid data type',
      });
      return;
    }

    // Get todo item and switch checked status
    ddbHelper.getItemAttribute(event, callback, dynamoDb, 'checked')
        .on('success', (response) => {
      console.log('old checked status ->', response.data.Item);
      let data = response.data.Item;
      data.checked = !data.checked;  // Toggle checked status
      console.log('new checked status ->', data.checked);
      toggleCheckStatus(data, callback);
    });
  };

})();
