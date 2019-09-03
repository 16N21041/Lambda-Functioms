var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({
    apiVersion: '2012-10-08'
});
exports.handler = async (event, context) => {
    let date = new Date();
    const tableName = process.env.TABLE_NAME;
    const region = process.env.REGION;
    aws.config.update({
        region: region
    });

    //Checking if the required attribute i.e., sub (or unique id) is present in "Cognito User Pool" or not.
    if (event.request.userAttributes.sub) {

        // -- Write data to DDB i.e., StudentTable.
        let ddbParams = {
            TableName: tableName,
            Item: {
                'instructorId': {
                    S: event.request.userAttributes.sub
                },
                'instructorEmail': {
                    S: event.request.userAttributes.email
                },
                'createdDate': {
                    S: date.toISOString()
                }
            }
        };

        // Calling DynamoDB.
        try {
            let ddbResult = await ddb.putItem(ddbParams).promise();
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success: Everything executed correctly")
        context.done(null, event);

    } else {
        // The student's Email-ID is unknown.
        console.log("Error: Nothing was written to DDB or SQS");
        context.done(null, event);
    }
};