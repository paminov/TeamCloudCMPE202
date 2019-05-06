// Whats going on here? This is where we are defining two set of 
// resources for our application, DEV and prod. When we build the 
// application via CodePipeline/ CodeBuild, we set the env variable
// respoectivly and it gets read here.
const dev = {
    API_GATEWAY: {
        REGION: "us-west-2",
        URL: "https://vjo82ubuvf.execute-api.us-west-2.amazonaws.com/dev"
    },
    COGNITO_IDENTITIES: {
        REGION: "us-west-2",
        USER_POOL_ID: "us-west-2_tPxVjZyBk",
        APP_CLIENT_ID: "1ses352p5c1lko337eupfdo8ai",
        IDENTITY_POOL_ID: "us-west-2:963f4cd3-0e3e-484d-8b0c-770602492cc7"
    },
};


export default dev;