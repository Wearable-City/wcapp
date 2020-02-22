const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = (event, context, callback) => {
    console.log("Function `users-read-by-ringid` invoked");
    console.log(event["queryStringParameters"]["username"]);
    return client
        .query(
            q.Paginate(
                q.Match(
                    q.Index("users_by_username"),
                    event["queryStringParameters"]["username"]
                )
            )
        )
        .then(response => {
            const userRefs = response.data;
            console.log("User refs", userRefs);
            console.log(`${userRefs.length} users found`);
            // create new query out of todo refs. http://bit.ly/2LG3MLg
            const getAllTodoDataQuery = userRefs.map(ref => {
                return q.Get(ref);
            });
            // then query the refs
            return client.query(getAllTodoDataQuery).then(ret => {
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(ret)
                });
            });
        })
        .catch(error => {
            console.log("error", error);
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify(error)
            });
        });
};
