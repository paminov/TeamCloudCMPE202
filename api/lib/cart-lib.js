import * as dynamoDbLib from "./dynamodb-lib";

export async function getCart(event) {
    const params = {
        TableName: process.env.carttableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        }
    };

    var result =  await dynamoDbLib.call("get", params);
    if (!result.Item) {
        await dynamoDbLib.call("put", {
            TableName: process.env.carttableName,
            Item: {
                userId: event.requestContext.identity.cognitoIdentityId,
                menuItems: [],
                totalCost: 0
            }
        });
        result =  await dynamoDbLib.call("get", params);
    }

    return result;
}


