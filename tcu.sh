curl -d '{ "ringId": "42069", "userName": "test", "firstName": "curl", "lastName": "Template", "contacts": [ { "firstName": "Sample", "lastName": "Contact", "phoneNumber": "1234567890", "alertMessage": "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus." } ] }' -H "Content-Type: application/json" -X POST https://wearablecity.netlify.com/.netlify/functions/users-create