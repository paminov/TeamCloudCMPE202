import * as dynamoDbLib from "./lib/dynamodb-lib";
import { success, failure } from "./lib/response-lib";
import { getCart } from "./lib/cart-lib";
import uuid from "uuid";

export async function retrieveCart(event, context) {
    try {
        const result = await getCart(event);

        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Failed to create cart"});
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}

export async function addItem(event, context) {
    const data = JSON.parse(event.body);
    const cart = await getCart(event);
    console.log("CART", cart);
    cart.Item.menuItems.push(data)
    const params = {
        TableName: process.env.carttableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
        UpdateExpression: "SET menuItems = :menuItems, totalCost = :totalCost",
        ExpressionAttributeValues: {
            ":menuItems": cart.Item.menuItems,
            ":totalCost": parseFloat(cart.Item.totalCost) + parseFloat(data.cost)
        }
    };

    try {
        await dynamoDbLib.call("update", params);
        const result = await getCart(event);
        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found."});
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}

export async function removeItem(event, context, callback) {
    const cart = await getCart(event);
    const item = cart.Item.menuItems.splice(event.pathParameters.item, 1)[0];
    const params = {
        TableName: process.env.carttableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
        UpdateExpression: "SET menuItems = :menuItems, totalCost = :totalCost",
        ExpressionAttributeValues: {
            ":menuItems": cart.Item.menuItems,
            ":totalCost": parseFloat(cart.Item.totalCost) - parseFloat(item.cost)
        }
    };

    try{
        await dynamoDbLib.call("update", params);
        const result = await getCart(event);
        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found."});
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}

export async function clearCart(event, context, callback) {
    const cart = await getCart(event);
    const params = {
        TableName: process.env.carttableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
        UpdateExpression: "SET menuItems = :menuItems, totalCost = :totalCost",
        ExpressionAttributeValues: {
            ":menuItems": [],
            ":totalCost": 0
        }
    };

    try{
        await dynamoDbLib.call("update", params);
        const result = await getCart(event);
        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found."});
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}
