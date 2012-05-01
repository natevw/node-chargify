var request = require('request');
var url = require('url');

function Chargify(options) {
    if (typeof options === 'string') {
        options = {
            subdomain: arguments[0],
            api_key: arguments[1]
        };
    };
    if (!(this instanceof Chargify)) {
        return new Chargify(options);
    }
    this.host = options.subdomain + '.chargify.com';
    this.api_key = options.api_key;
};

Chargify.prototype.request = function(options, callback) {
    options.uri = options.uri || url.format({
        protocol: 'https',
        host: this.host,
        auth: this.api_key + ':x',
        pathname: options.pathname
    });
    options.headers = {
        'content-type': 'application/json',
        'accept': 'application/json'
    };
    request(options, function(err, res, body) {
        if (err) return callback(err);
        try {
            var body = JSON.parse(body);
        } catch(e) {}
        callback(err, res, body);
    });
};

Chargify.prototype.get = function(options, callback) {
    if (typeof options === 'string') options = {pathname:options}
    options.method = 'GET';
    this.request(options, callback);
};

Chargify.prototype.post = function(options, callback) {
    if (typeof options === 'string') options = {pathname:options}
    options.method = 'POST';
    this.request(options, callback);
};

Chargify.prototype.put = function(options, callback) {
    if (typeof options === 'string') options = {pathname:options}
    options.method = 'PUT';
    this.request(options, callback);
};

Chargify.prototype.head = function(options, callback) {
    if (typeof options === 'string') options = {pathname:options}
    options.method = 'HEAD';
    this.request(options, callback);
};

Chargify.prototype.del = function(options, callback) {
    if (typeof options === 'string') options = {pathname:options}
    options.method = 'DELETE';
    this.request(options, callback);
};

module.exports = Chargify;
