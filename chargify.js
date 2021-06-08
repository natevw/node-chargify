var request = require('request');
var _ = require('underscore');
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
    options.uri = options.uri || options.url;
    options.uri = url.format(_(url.parse(options.uri)).defaults({
        protocol: 'https',
        host: this.host,
        auth: this.api_key + ':x'
    }));
    options.headers = {
        'accept': 'application/json'
    };
    request(options, function(err, res, body) {
        if (err) return callback(err);
        if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') !== -1 && typeof body !== 'object') {
            try {
                res.body = body = JSON.parse(body);
            } catch(e) {
                return callback(e);
            }
        }
        callback(err, res, body);
    });
};

Chargify.prototype.get = function(options, callback) {
    if (typeof options === 'string') options = {uri:options}
    options.method = 'GET';
    this.request(options, callback);
};

Chargify.prototype.post = function(options, callback) {
    if (typeof options === 'string') options = {uri:options}
    options.method = 'POST';
    this.request(options, callback);
};

Chargify.prototype.put = function(options, callback) {
    if (typeof options === 'string') options = {uri:options}
    options.method = 'PUT';
    this.request(options, callback);
};

Chargify.prototype.head = function(options, callback) {
    if (typeof options === 'string') options = {uri:options}
    options.method = 'HEAD';
    this.request(options, callback);
};

Chargify.prototype.del = function(options, callback) {
    if (typeof options === 'string') options = {uri:options}
    options.method = 'DELETE';
    this.request(options, callback);
};

module.exports = Chargify;
