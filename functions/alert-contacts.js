const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});

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
