/* code from functions/todos-create.js */
const faunadb = require("faunadb"); /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
    /* parse the string body into a useable JS object */
    console.log("Function `users-edit-data` invoked", event.body);
    /* construct the fauna query */
    return client
        .query(
            q.Update(
                q.Ref(q.Collection("users"), event["queryStringParameters"]["fid"]),
                {
                    data: event.body
                }
            )
        )
        .then(response => {
            console.log("success", response);
            /* Success! return the response with statusCode 200 */
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(response)
            });
        })
        .catch(error => {
            console.log("error", error);
            /* Error! return the error with statusCode 400 */
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify(error)
            });
        });
};
