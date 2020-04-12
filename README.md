# Wearable City

This repo contains the web services needed to power the Wearable City project in CS 4605 at Georgia Tech.

## API Description

### What does a `user` object look like?

This is a sample `user` response from the DB, which I will call `SampleUserResponse`:

```JSON
 {
    "ref": {
      "@ref": {
        "id": "257115234834055699",
        "collection": {
          "@ref": {
            "id": "users",
            "collection": {
              "@ref": {
                "id": "collections"
              }
            }
          }
        }
      }
    },
    "ts": 1586732962950000,
    "data": {
      "ringId": "42069",
      "userName": "test1",
      "firstName": "curl",
      "lastName": "Template",
      "password": "password",
      "contacts": [
        {
          "id": "ecdbb7e3-5df7-444c-abdc-f3896d245dae",
          "firstName": "New",
          "lastName": "Name",
          "phoneNumber": "1234567890",
          "alertMessage": "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
        },
        {
          "id": "5cea42f5-9637-40c7-93d6-cf108abf5435",
          "firstName": "Name2",
          "lastName": "Contact",
          "phoneNumber": "1234567890",
          "alertMessage": "Sed posuere consectetur est at lobortis."
        }
      ]
    }
  }
```

The `data` subobject is the actual stuff saved in the DB. The `ref` subobject is metadata about the user data, which is added on by the API. The only thing we care about in there is `id`, which identifies this specific user data in the DB and is needed for one of the API endpoints.

Our app, specifically in `ContactList`, will get a `user` object from the API, like `SampleUserResponse`. We will extract the important stuff from this response, namely `SampleUserResponse.data` and `SampleUserResponse.ref["@ref"].id`. We put `SampleUserResponse.data` into `state.user` and `SampleUserResponse.ref["@ref"].id` into `state.ref`. This way we have access to the important parts of a user's data in our component state.

### API Description

#### Create a new user

-   Endpoint: https://wearablecity.netlify.com/.netlify/functions/users-create
-   Method: `POST`
-   Body:
    ```JSON
    {
        "ringId": "this should be a number, you'll have to add it manually. I'll automate it later.",
        "userName": "a_username",
        "firstName": "Jane",
        "lastName": "Doe",
        "password": "password",
        "contacts": [
            {
                "id": "this should be a GUID, you'll have to add it manually. I'll automate it later. Go to https://www.guidgenerator.com/ to make one for now and paste it in here.",
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "1234567890",
                "alertMessage": "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
            },
        ]
    }
    ```
-

#### Edit user data

-   Endpoint: https://wearablecity.netlify.com/.netlify/functions/users-edit-data
-   Method: `POST`
-   Query String Params:
    -   `ref`: a ref number, as indicated up in the [user description section](#What-does-a-user-look-like?). Stored in `ref.id`.
-   Body:
    This method is fancy. You can send it a JSON object with any of the keys for a [user](#What-does-a-user-look-like?) and it will update it with the value you assign that key in the request body.
    So if you sent

    ```JSON
    {
        "userName": "MyNewUserName"
    }
    ```

    to ref 257115234834055699 (the one from the example above), that user object would now be

    ```JSON
    {
        "ref": {
        "@ref": {
            "id": "257115234834055699",
            "collection": {
            "@ref": {
                "id": "users",
                "collection": {
                "@ref": {
                    "id": "collections"
                }
                }
            }
            }
        }
        },
        "ts": 1586732962950000,
        "data": {
            "ringId": "42069",
            "userName": "MyNewUserName",
            "firstName": "curl",
            "lastName": "Template",
            "password": "password",
            "contacts": [
                {
                    "id": "ecdbb7e3-5df7-444c-abdc-f3896d245dae",
                    "firstName": "New",
                    "lastName": "Name",
                    "phoneNumber": "1234567890",
                    "alertMessage": "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
                },
                {
                    "id": "5cea42f5-9637-40c7-93d6-cf108abf5435",
                    "firstName": "Name2",
                    "lastName": "Contact",
                    "phoneNumber": "1234567890",
                    "alertMessage": "Sed posuere consectetur est at lobortis."
                }
            ]
        }
    }
    ```

    Notice that the only thing that changed is the `userName` key. This works with any other key. So if you wanted to delete the second entry from `contacts` (the one named Name2 Contact), you could send

    ```JSON
    {
        "contacts": [
            {
                "id": "ecdbb7e3-5df7-444c-abdc-f3896d245dae",
                "firstName": "New",
                "lastName": "Name",
                "phoneNumber": "1234567890",
                "alertMessage": "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus."
            }
        ]
    }
    ```

    and it would update the `contacts` array to have that second contact deleted. We have a local copy of the user's data that we get when we fetch; it's the state data (`this.state.user`). Make any changes to _that_ object. Once the user is done changing stuff (adding, editing, deleting, etc), simply make that object the body of a request to this endpoint and all those changes will save.

####
