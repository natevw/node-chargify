Easy integration with [Chargify][0] for adding recurring payments to your
application.

This module is essentially a wrapper around [Request][1], but adds a little
convenience for connecting to the [Chargify API][2].

[0]:http://chargify.com/
[1]:https://github.com/mikeal/request
[2]:http://docs.chargify.com/api-resources
[3]:https://github.com/mikeal/request/blob/master/README.md

## Example

You can normally require and instantiate at the same time using your Chargify
subdomain and API key.

    var chargify = require('chargify');
    var chargify_site = chargify('YOUR-CHARGIFY-SUBDOMAIN', 'YOUR-API-KEY');

List subscriptions:

    chargify_site.get('subscriptions.json', function(err, res, body) {
        if (err) throw err;
        console.log(res.statusCode);
        console.log(body);
    });

Load subscription #40:

    chargify_site.get('subscriptions/40.json', function(err, res, body) {
        if (err) throw err;
        console.log(res.statusCode);
        console.log(body);
    });

Create a new customer:

    chargify_site.post({
        pathname: 'customers.json',
        json: {
            customer: {
                first_name: 'Joe',
                last_name: 'Blow',
                email: 'joe@example.com'
            }
        }
    }, function(err, res, body) {
        if (err) throw err;
        console.log(res.statusCode);
        console.log(body);
    });

## Documentation

### chargify(subdomain, api_key)

Returns a chargify_site. The available methods are listed below.

- chargify_site.get(options, callback)
- chargify_site.post(options, callback)
- chargify_site.put(options, callback)
- chargify_site.del(options, callback)

The first argument can be either a url or an options object. he only required
key is `uri`. The only required option is uri, all others are optional. The key
attributes are listed below. See the [Request module's README][3] for a full list.

- `uri` - Required. The URI of the resource. `host`, `protocol`, and `auth`
   information are optional.
- `json` - sets the body of the request using a JavaScript object.

## See also

- [Request documentation](https://github.com/mikeal/request/blob/master/README.md)
- [Chargify API documentation][2]

## Testing

Before running the tests, you need to create a Chargify test site and specify
the site's subdomain and your API key in a JSON file called config.json.

Example config.json file:

    {
        "chargifySubdomain": "chargify-test",
        "chargifyAPIKey": "xxxxxxxxxxxxxx-9x_"
    }

Then simply run:

    npm test

## License

Copyright © 2011 by &yet, LLC. Released under the terms of the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
