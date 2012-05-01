var request = require('request');
var url = require('url');

function Chargify(options) {
    this.host = options.host;
    this.auth = 'Basic ' + new Buffer(options.api_key + ':x').toString('base64');
};

Chargify.prototype.request = function(options, callback) {
    options.uri = options.uri || url.format({
        protocol: 'https',
        host: this.host,
        pathname: options.pathname
    });
    options.headers = {
        'Authorization': this.auth,
        'Content-Type': 'application/json',
        'Content-Length': 0,
        'Accept': 'application/json'
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

function chargify(subdomain, api_key) {
    var options = {
        host: subdomain + '.chargify.com',
        api_key: api_key
    };
    return new Chargify(options);
};

module.exports = chargify;
