import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from "aws-amplify";
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import configurations from "./utils/configurations";
import App from './App/App';

// We are configuring amplify with the necessary auths here
const { COGNITO_IDENTITIES, API_GATEWAY} = configurations;
// Cognito Stuff
const { REGION: COGNITO_REGION, IDENTITY_POOL_ID, USER_POOL_ID, APP_CLIENT_ID } = COGNITO_IDENTITIES
// API Gateway Stuff
const { REGION: API_GATEWAY_REGION, URL } = API_GATEWAY

Amplify.configure({
    // Set identity pools
    Auth: {
        mandatorySignIn: true,
        region: COGNITO_REGION,
        userPoolId: USER_POOL_ID,
        identityPoolId: IDENTITY_POOL_ID,
        userPoolWebClientId: APP_CLIENT_ID
    },
    // Set endpoint that will be called
    API: {
        endpoints: [
            {
                name: "",
                endpoint: URL,
                region: API_GATEWAY_REGION
            },
        ]
    }
});

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById("root")
);