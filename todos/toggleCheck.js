(function () {
  'use strict';

  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  module.exports.toggleCheck = (event, context, callback) => {

    const eventData = JSON.parse(event.body);

    // Check for empty data
    if (!eventData.checked) {
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain', },
        body: 'No event data'
      });
      return;
    }

    // Check for valid data type
    if (typeof eventData.checked !== 'boolean') {
      console.log('eventData ->', eventData);
      console.log('eventData.checked ->', eventData.checked);
      console.error('Invalid eventData');
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Invalid data type',
      });
      return;
    }

    // Get id's current checked state
    const ddbParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };

    const todoItemReq = dynamoDb.get(ddbParams, (error, result) => {
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
    });

    todoItemReq.on('success', (response) => {
      console.log('resp.data.item ->', response.data.Item);
      console.log('resp.data.item.checked ->', response.data.Item.checked);
      let data = response.data.Item;
      // Toggle checked status
      data.checked = !data.checked;
      console.log('data.checked after ->', data.checked);
      toggleCheckStatus(data, callback);
    });

    // --------------------------------

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

    };

})();
