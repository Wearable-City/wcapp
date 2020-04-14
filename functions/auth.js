const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = (event, context, callback) => {
    console.log("Function `auth` invoked");
    let data = JSON.parse(event.body);
    console.log(data.userName);
    let sentPassword = data.password;
    console.log(data.password);
    return client
        .query(q.Paginate(q.Match(q.Index("users_by_username"), data.userName)))
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
                console.log(ret);
                if (ret.length === 0) {
                    console.log("bad usr name");
                    return callback(null, {
                        statusCode: 400,
                        body: { error: "Invalid username" },
                        headers: { "Access-Control-Allow-Origin": "*" },
                    });
                }
                if (ret[0].data.password === sentPassword) {
                    console.log(ret[0]);
                    return callback(null, {
                        statusCode: 200,
                        body: JSON.stringify({ token: `${Date.now().toString()}` }),
                        headers: { "Access-Control-Allow-Origin": "*" },
                    });
                } else {
                    console.log("bad password");
                    return callback(null, {
                        statusCode: 401,
                        body: {
                            error: "Invalid password",
                        },
                        headers: { "Access-Control-Allow-Origin": "*" },
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
