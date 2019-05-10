import * as dynamoDbLib from "./lib/dynamodb-lib";
import { success, failure } from "./lib/response-lib";

//creates preference
export async function createCard(event, context) {
    const data = JSON.parse(event.body);
    console.log("DATA:", data, process.env.cardstableName)
    const params = {
        TableName: process.env.cardstableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            cardNumber: data.cardNumber,
            pin: data.pin,
            balance: data.balance,
        }
    };

    try{
        await dynamoDbLib.call("put", params);
        return success({ status: true });
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }

}

export async function retrieveCard(event, context) {
    const params = {
        TableName: process.env.cardstableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        }
    };

    try{
        const result = await dynamoDbLib.call("get", params);
        if (result.Item) {
          // Return the retrieved item
          return success(result.Item);
        } else {
          return success({cardNumber:"", pin: "", balance: "0"});
        }
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }
}

export async function removeCard(event, context) {

    const params = {
        TableName: process.env.cardstableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
        ReturnValues: 'ALL_OLD'
    };

    try{
        await dynamoDbLib.call("delete", params);
        return success({ status: true });
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }
}

export async function updateCard(event, context) {
    var data;
    if (typeof(event.body)=="string") {
        data = JSON.parse(event.body);
    } else {
        data = event.body;
    }
    console.log("UPDATE_CARD_BODY:", event.body, typeof(event.body), "DATA:", data);
    const params = {
        TableName: process.env.cardstableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
            UpdateExpression: null,
            ExpressionAttributeValues: {}
    };

    for(var prop in data) {
        if (!params.UpdateExpression) {
            params.UpdateExpression = `SET ${prop} = :${prop}`;
        } else {
            params.UpdateExpression += `, ${prop} = :${prop}`;
        }
        params.ExpressionAttributeValues[`:${prop}`] = data[prop];
    }

    try{
        await dynamoDbLib.call("update", params);
        return success({ status: true });
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }
}
