import AWS from "aws-sdk";

/**
 * Helper function to make db calls
 * @param action: string indicating which db action should be performed
 *                e.g. "put", "get", "scan", etc.
 * @param params: JSON object containing query filters as well as data (if
 *                modifying data)
 * @return JSON reponse from db if any
 */
export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}
