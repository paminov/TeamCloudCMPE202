// Whats going on here? This is where we are defining two set of 
// resources for our application, DEV and prod. When we build the 
// application via CodePipeline/ CodeBuild, we set the env variable
// respoectivly and it gets read here.
const dev = {
    API_GATEWAY: {
        REGION: "us-west-2",
        URL: "https://cthvst61hc.execute-api.us-west-2.amazonaws.com/dev"
    },
    COGNITO_IDENTITIES: {
        REGION: "us-west-2",
        USER_POOL_ID: "us-west-2_qb5akNPYj",
        APP_CLIENT_ID: "1prq7v3pptktrcfqmue046gal6",
        IDENTITY_POOL_ID: "us-west-2:8afacc72-1f21-4135-8cd3-46c9767848ac"
    },
};


export default dev;