const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});
const accountSid = process.env.TWILIO_AUTH;
const authToken = process.env.TWILIO_AUTH;
const twilioClient = require("twilio")(accountSid, authToken);
const TWILIO_PHONE_NUM = "+12056288846";
const TEST_NUM = "+14044287664";

twilioClient.messages
    .create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: TWILIO_PHONE_NUM,
        to: TEST_NUM,
    })
    .then((message) => console.log(message.sid));

exports.handler = (event, context, callback) => {
    console.log("Function `alert-contacts` invoked");
    console.log(event["queryStringParameters"]["ringid"]);
    return client
        .query(
            q.Paginate(
                q.Match(
                    q.Index("users_by_ringID"),
                    event["queryStringParameters"]["ringid"]
                )
            )
        )
        .then((response) => {
            const userRefs = response.data;
            console.log("User refs", userRefs);
            console.log(`${userRefs.length} users found`);
            // create new query out of todo refs. http://bit.ly/2LG3MLg
            const getUserQuery = userRefs.map((ref) => {
                return q.Get(ref);
            });
            // then query the refs
            return client.query(getUserQuery).then((ret) => {
                // call Twilio API
                console.log(ret);
                ret[0].data.contacts.forEach((contact) => {
                    console.log(`Calling twilio for ${contact.phoneNumber}`);
                });
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(ret),
                    headers: { "Access-Control-Allow-Origin": "*" },
                });
            });
        })
        .catch((error) => {
            console.log("error", error);
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify(error),
            });
        });
};
