import * as dynamoDbLib from "./lib/dynamodb-lib";
import { success, failure } from "./lib/response-lib";
import AWS from "aws-sdk";

/**
 * Handler for /menu GET call
 * @param event: JSON Object containing Request Object and Path parameters
 * @param context: Lambda Context
 * @return JSON object containing list of menu items or error message
 */
export async function list(event, context) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.menutableName
    };

    try {
        const scanResult = await dynamoDb.scan(params).promise();
        if(scanResult){
            console.log(scanResult);
            return success(scanResult);
        } else {
            console.log(err);
            return failure({ status: false, error: "Item not found."});
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}
