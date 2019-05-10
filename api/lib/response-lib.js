/**
 * Helper function to return success response
 * @param body: JS object representing body of the response
 * @return JSON Response containing cart items of a user
 */
export function success(body) {
  return buildResponse(200, body);
}

/**
 * Helper function to raise failing status code response.
 * @param body: JS object representing body of the response
 * @return JSON Response containing cart items of a user
 */
export function failure(body) {
  return buildResponse(500, body);
}

/**
 * Helper function to prepare response object
 * @param statusCode:  HTML status code to return
 * @param body: JS object representing body of the response
 * @return response object
 */
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
