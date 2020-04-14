const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = (event, context, callback) => {
    console.log("Function `auth` invoked");
    console.log(event.body.userName);
    let sentPassword = event.body.userName;
    console.log(event.body.password);
    return client
        .query(q.Paginate(q.Match(q.Index("users_by_username"), event.body.userName)))
        .then((response) => {
            const userRefs = response.data;
            console.log("User refs", userRefs);
            console.log(`${userRefs.length} users found`);
            // create new query out of todo refs. http://bit.ly/2LG3MLg
            const getAllTodoDataQuery = userRefs.map((ref) => {
                return q.Get(ref);
            });
            // then query the refs
            return client.query(getAllTodoDataQuery).then((ret) => {
                if (ret.length === 0) {
                    return callback(null, {
                        statusCode: 400,
                        body: { error: "Invalid username" },
                    });
                }
                if (ret[0].data.password === sentPassword) {
                    return callback(null, {
                        statusCode: 200,
                        body: { token: `${ret[0].ref["@ref"].id}` },
                    });
                } else {
                    return callback(null, {
                        statusCode: 401,
                        body: {
                            error: "Invalid password",
                        },
                    });
                }
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
