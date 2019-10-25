(function () {
  'use strict';

  module.exports.getItemAttribute = (event, callback, dbClient, attr) => {
   const ddbParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
      AttributesToGet: [
        attr,
      ],
    };
    return dbClient.get(ddbParams, (error, data) => {
      if (error) {
       console.error(error);
       callback(null, {
         statusCode: error.statusCode,
         headers: { 'Content-Type': 'text/plain' },
         body: 'Couldn\'t retrieve todo item',
       });
      } else {
        return data;
      }
    });
  };

})();
