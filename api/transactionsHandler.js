import * as dynamoDbLib from "./lib/dynamodb-lib";
import { success, failure } from "./lib/response-lib";
import AWS from "aws-sdk";
AWS.config.region = "us-west-2";

const lambdaName = "starbucks-app-api-" + process.env.stage;
console.log('STAGE', process.env.stage);

const getLambda = (lambda, params) => new Promise((resolve, reject) => {
  lambda.invoke(params, (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
});

//creates preference
export async function addTransaction(event, context) {
    try{
        const lambda = new AWS.Lambda();
        var totalCost =0;
        var cardBalance=0;
        var cartItem;
        var card;
        const params1 = {
            FunctionName: lambdaName + "-getCart",
            Payload: JSON.stringify({
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                    }
                }
            }),
        };

        const resp1 = await getLambda(lambda, params1);
        const payload1 = JSON.parse(resp1.Payload);
        console.log('getLambda getCart returned payload', payload1);

        if (payload1.body) {
            cartItem = JSON.parse(payload1.body);
            totalCost = cartItem.totalCost;
        } else {
            return failure({ status: false, error: "Cart is Empty."});
        }

        const params2 = {
            FunctionName: lambdaName + "-cardGet",
            Payload: JSON.stringify({
                    "requestContext": {
                        "identity": {
                            "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                        }
                    }
            }),
        };
        const resp2 = await getLambda(lambda, params2);
        const payload2 = JSON.parse(resp2.Payload);
        console.log('getLambda cardGet returned payload', payload2);

        if (payload2.body) {
            card = JSON.parse(payload2.body);
            cardBalance = card.balance;
        } else {
            return failure({ status: false, error: "No Card added for user"});
        }

        var balance = cardBalance-totalCost;
        if(balance>0) {
            const params3 = {
                FunctionName: lambdaName + "-cardUpdate",
                Payload: JSON.stringify({
                    "body": {
                        "balance": balance
                    },
                    "requestContext": {
                        "identity": {
                            "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                        }
                    }
                })
            };

            console.log("Calling CardUpdate");
            const resp3 = await getLambda(lambda, params3);

            console.log('Response of CardUpdate',resp3);

            var params = {
                TableName: process.env.transactiontableName,
                Key: {
                    userID: event.requestContext.identity.cognitoIdentityId
                },
            }

            console.log("Calling Get on transaction table");
            var result =  await dynamoDbLib.call("get", params);

            if(!result.Item) {
                console.log("Calling Put on transaction table");
                params = {
                TableName: process.env.transactiontableName,
                Item: {
                    userID: event.requestContext.identity.cognitoIdentityId,
                    menuItems: cartItem.menuItems,
                    totalCost: cartItem.totalCost,
                    }
                };
                await dynamoDbLib.call("put", params);
            } else {
                console.log("Calling update on transaction table");
                params = {
                    TableName: process.env.cardstableName,
                    Key: {
                        userID: event.requestContext.identity.cognitoIdentityId
                    },
                        UpdateExpression: "SET menuItems = :menuItems, totalCost = :totalCost",
                        ExpressionAttributeValues: {
                            ":menuItems": cartItem.menuItems,
                            ":totalCost": cartItem.totalCost
                        }
                };
                await dynamoDbLib.call("update", params);
            }

            return success({ status: true });
        } else {
            return failure({ status: false, error: "Insufficient balance, reload Card"});
        }
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }

}

export async function getTransactions(event, context) {
    const params = {
        TableName: process.env.transactiontableName,
        Key: {
            userID: event.requestContext.identity.cognitoIdentityId
        }
    };

    try{
        const result = await dynamoDbLib.call("get", params);
        if (result) {
          // Return the retrieved item
          return success(result);
        } else {
          return failure({ status: false, error: "Item not found."});
        }
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }
}

export async function clearTransactions(event, context) {

    const params = {
        TableName: process.env.transactiontableName,
        Key: {
            userID: event.requestContext.identity.cognitoIdentityId
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
