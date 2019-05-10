import * as dynamoDbLib from "./lib/dynamodb-lib";
import { success, failure } from "./lib/response-lib";
import AWS from "aws-sdk";
import uuid from "uuid";
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

        const paramsGetCart = {
            FunctionName: lambdaName + "-getCart",
            Payload: JSON.stringify({
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                    }
                }
            }),
        };

        const respGetCart = await getLambda(lambda, paramsGetCart);
        const payloadGetCart = JSON.parse(respGetCart.Payload);
        console.log('getLambda getCart returned payload', payloadGetCart);

        if (payloadGetCart.body) {
            cartItem = JSON.parse(payloadGetCart.body);
            totalCost = cartItem.totalCost;
        } else {
            return failure({ status: false, error: "Cart is Empty."});
        }

        const paramsGetCard = {
            FunctionName: lambdaName + "-cardGet",
            Payload: JSON.stringify({
                    "requestContext": {
                        "identity": {
                            "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                        }
                    }
            }),
        };
        const respGetCard = await getLambda(lambda, paramsGetCard);
        const payloadGetCard = JSON.parse(respGetCard.Payload);
        console.log('getLambda cardGet returned payload', payloadGetCard);

        if (payloadGetCard.body) {
            card = JSON.parse(payloadGetCard.body);
            cardBalance = card.balance;
        } else {
            return failure({ status: false, error: "No Card added for user"});
        }

        var balance = cardBalance-totalCost;
        if(balance>0) {
            const paramsUpdateCard = {
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
            const respUpdateCard = await getLambda(lambda, paramsUpdateCard);

            console.log('Response of CardUpdate',respUpdateCard);

            console.log("Calling Put on transaction table");
            var params = {
            TableName: process.env.transactiontableName,
            Item: {
                transactionId: uuid.v1(),
                userID: event.requestContext.identity.cognitoIdentityId,
                menuItems: cartItem.menuItems,
                totalCost: cartItem.totalCost,
                }
            };
            await dynamoDbLib.call("put", params);

            const paramsClearCart = {
            FunctionName: lambdaName + "-clearCart",
            Payload: JSON.stringify({
                    "requestContext": {
                        "identity": {
                            "cognitoIdentityId": event.requestContext.identity.cognitoIdentityId
                        }
                    }
                }),
            };
            const respClearCart = await getLambda(lambda, paramsClearCart);
            const payloadClearCart = JSON.parse(respClearCart.Payload);
            console.log('getLambda clearCart returned payload', payloadClearCart);

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
		FilterExpression: '#userID = :userId',
		ExpressionAttributeNames: {
    		'#userID': 'userID',
		},
		ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
		},
    };

    try{
        const result = await dynamoDbLib.call("scan", params);
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
    const scan_params = {
        TableName: process.env.transactiontableName,
		FilterExpression: '#userID = :userId',
		ExpressionAttributeNames: {
    		'#userID': 'userID',
		},
		ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
		},
    };

    try{
        const result = await dynamoDbLib.call("scan", scan_params);
        console.log("RESULT: ", result);
        var params = {
            TableName: process.env.transactiontableName,
            Key: {
                transactionId: '',
                userID: event.requestContext.identity.cognitoIdentityId
            },
            ReturnValues: 'ALL_OLD'
        };
        for (var i in result.Items) {
            params.Key.transactionId = result.Items[i].transactionId;
            console.log(params)
            await dynamoDbLib.call("delete", params);
        }
        return success({ status: true });
    } catch (e) {
      console.log(e);
      return failure({ status: false });
    }
}
