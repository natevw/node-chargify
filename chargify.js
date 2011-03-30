/*
// This is essentially a generic REST interface wrapper that allows Chargify's URLs to be formed and accessed.
//
// See http://docs.chargify.com/api-resources and surrounding pages for up-to-date Chargify documentation.
//
//
// A site is wrapped in a representation of its base URL:
//   var wrapped_site = chargify.wrapSite('example-site', "API_KEY");
//
// This base URL can be extended...
//   var some_subscription = wrapped_site('subscriptions')(42);
//
// ...and queried (i.e. GET):
//   some_subscription(function (status, data) { if (status === 200) console.log(data.subscription.state); });
//
// ...and updated (i.e. PUT):
//   some_subscription('components')(5)({component:{allocated_quantity:9}}, function (s, info) { console.log(info); });
//
// ...and used to add or remove objects (i.e. POST, DELETE):
//   wrapped_site('customers').add({customer:{first_name:"Sir",last_name:"Pedro"}}, function (s, info) {
//     wrapped_site('customers')(info.customer.id).remove(function (s, info) {});
//   });
//
// The full API of the URL wrapper interface is as follows:
// () - return wrapped URL as string
// (string/number/etc) - return another URL wrapper with given path component appended
// (callback) - GET on wrapped URL [alias for .get(null, cb)]
// (dict, callback) - PUT on wrapped URL [alias for .put]
// .add(dict, callback) - POST on wrapped URL [alias for .post]
// .remove(callback) - DELETE on wrapped URL [alias for .del(null, cb)]
// .get(dict, callback) - GET on wrapped URL with query parameters from dict
// .put(dict, callback) - PUT on wrapped URL with dict sent as JSON body
// .post(dict, callback) - POST on wrapped URL with dict sent as JSON body
// .del(dict, callback) - DELETE on wrapped URL with dict sent as JSON body
// .req(query, method, dict, callback) - <method> on wrapped URL (plus query parameters) with data as JSON for body (query, data may be null)
//
// Ideally it'd be an even cleaner (e.g.) `site.subscriptions[id].components[id].usages()` once JS gets Proxy object
// support like Firefox now has -- see http://code.google.com/p/v8/issues/detail?id=633 for V8 implementation status.
// It would be easy to make this pluggable for *any* JSON-compatible REST API as well.
*/
exports.wrapSite = function (subdomain, api_key) {
    var host = subdomain + ".chargify.com";
    var auth = 'Basic ' + new Buffer(api_key + ':x').toString('base64');
    
    var https = require('https');
    function _request(path, method, requestObj, yieldResponse) {
        var req = https.request({
            host: host,
            method: method,
            path: path,
            headers: {
                'Authorization': auth,
                'Content-Type': "application/json",
                'Content-Length': 0,
                'Accept': "application/json"
            }
        });
        if (requestObj) {
            var requestText = JSON.stringify(requestObj);
            req.setHeader('Content-Length', Buffer.byteLength(requestText))
            req.write(requestText);
        }
        req.end();
        
        req.on('error', function () {
            callback(0, "Connection error");
        });
        req.on('response', function (res) {
            res.setEncoding('utf8');
            var responseText = "";
            res.on('data', function (chunk) {
                responseText += chunk;
            });
            res.on('end', function () {
                try {
                    var responseObj = JSON.parse(responseText);
                } catch (e) {
                    return yieldResponse(res.statusCode, responseText);
                }
                yieldResponse(res.statusCode, responseObj);
            });
        });
    }
    
    function _makeExtendableURL(path) {
        path || (path = '');
        var extendableURL = function () {
            if (arguments.length === 0) {
                return "https://" + host + path;
            } else if (arguments.length === 1 && typeof(arguments[0]) === 'function') {
                extendableURL.get(null, arguments[0]);
            } else if (arguments.length === 1) {
                return _makeExtendableURL(path + '/' + encodeURIComponent(arguments[0]));
            } else if (arguments.length === 2) {
                extendableURL.put(arguments[0], arguments[1]);
            }
        };
        
        extendableURL.req = function (query, method, data, callback) {
            var pathWithQuery = (path) ? path + '.json' : '/';
            if (query) {
                pathWithQuery += '?' + Object.keys(query).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
                }).join('&');
            }
            _request(pathWithQuery, method, data, callback);
        };
        
        extendableURL.get = function (query, callback) {
            extendableURL.req(query, 'GET', null, callback);
        };
        
        extendableURL.put = function (data, callback) {
            extendableURL.req(null, 'PUT', data, callback);
        };
        
        extendableURL.add = extendableURL.post = function (data, callback) {
            extendableURL.req(null, 'POST', data, callback);
        };
        
        extendableURL.remove = function (callback) {
            extendableURL.req(null, 'DELETE', null, callback);
        };
        extendableURL.del = function (data, callback) {
            extendableURL.req(null, 'DELETE', data, callback);
        };
        
        return extendableURL;
    }
    return _makeExtendableURL();
}
