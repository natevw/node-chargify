This is a fairly generic REST interface wrapper that allows Chargify URLs to be accessed from node.js.
See <http://docs.chargify.com/api-resources> and surrounding pages for up-to-date Chargify documentation.


A site is wrapped in a representation of its base URL:

    var wrapped_site = chargify.wrapSite('example-site', "API_KEY");

This base URL can be extended...

    var some_subscription = wrapped_site('subscriptions')(42);

...and queried (i.e. GET):

    some_subscription(function (status, data) { if (status === 200) console.log(data.subscription.state); });

...and updated (i.e. PUT):

    some_subscription('components')(5)({component:{allocated_quantity:9}}, function (status, info) { console.log(info); });

Or, used to add or remove objects (i.e. POST, DELETE):

    var customerInfo = {customer:{first_name:"Sir",last_name:"Pedro",email:"user@example.com"}};
    wrapped_site('customers').add(customerInfo, function (s, info) {
        // NOTE: Chargify currently returns 403 from this request, as customer deletion is not supported
        wrapped_site('customers')(info.customer.id).remove(function (s, info) {});
    });


The full API of the URL wrapper interface is as follows:

* `()` - return wrapped URL as string
* `(string/number/etc.)` - return another URL wrapper with given path component appended
* `(callback)` - GET on wrapped URL [alias for `.get(null, cb)`]
* `(dict, callback)` - PUT on wrapped URL [alias for `.put`]
* `.add(dict, callback)` - POST on wrapped URL [alias for `.post`]
* `.remove(callback)` - DELETE on wrapped URL [alias for `.del(null, cb)`]
* `.get(dict, callback)` - GET on wrapped URL with query parameters from dict
* `.put(dict, callback)` - PUT on wrapped URL with dict sent as JSON body
* `.post(dict, callback)` - POST on wrapped URL with dict sent as JSON body
* `.del(dict, callback)` - DELETE on wrapped URL with dict sent as JSON body
* `.req(query, method, dict, callback)` - _METHOD_ on wrapped URL (plus query parameters) with data as JSON for body (`query` and `data` may be null)