var assert = require('assert');
var path = require('path');
var fs = require('fs');
var chargify = require('../chargify');

describe('chargify', function() {
    before(function(done) {
        if (fs.existsSync('config.json')) {
            var config = JSON.parse(fs.readFileSync('config.json'));
            chargify = chargify(config.chargifySubdomain, config.chargifyAPIKey);
        } else {
            console.error('config.json is required to run tests');
            process.exit(1);
        }
        done();
    });
    describe('customer', function() {
        var id;
        describe('post()', function() {
            it('should return HTTP 201 for a valid customer', function(done) {
                chargify.post({
                    uri: 'customers.json',
                    json: {
                        customer: {
                            first_name: 'Joe',
                            last_name: 'Blow',
                            email: 'joe@example.com'
                        }
                    }
                }, function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 201);
                    assert.ok(body.customer);
                    assert.ok(body.customer.id);
                    assert.strictEqual(body.customer.first_name, 'Joe');
                    id = body.customer.id;
                    done();
                });
            });
            it('should return HTTP 422 when last_name is missing', function(done) {
                chargify.post({
                    uri: 'customers.json',
                    json: {
                        customer: {
                            first_name: 'Joe',
                            email: 'joe@example.com'
                        }
                    }
                }, function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 422);
                    assert.ok(body.errors);
                    assert.strictEqual(body.errors[0], 'Last name: cannot be blank.');
                    done();
                });
            });
        });
        describe('put()', function() {
            it('should return HTTP 200 for a valid customer', function(done) {
                chargify.put({
                    uri: 'customers/' + id + '.json',
                    json: {
                        customer: {
                            last_name: 'Smith'
                        }
                    }
                }, function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 200);
                    assert.ok(body.customer);
                    assert.ok(body.customer.id);
                    assert.strictEqual(body.customer.first_name, 'Joe');
                    assert.strictEqual(body.customer.last_name, 'Smith');
                    done();
                });
            });
            it('should return HTTP 422 for an invalid email', function(done) {
                chargify.put({
                    uri: 'customers/' + id + '.json',
                    json: {
                        customer: {
                            email: 'bademail'
                        }
                    }
                }, function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 422);
                    assert.ok(body.errors);
                    assert.strictEqual(body.errors[0], 'Email: must be a valid email address');
                    done();
                });
            });
        });
        describe('get()', function() {
            it('should list users', function(done) {
                chargify.get('customers.json', function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 200);
                    assert.ok(body.length);
                    done();
                });
            });
            it('should list users with ?page=2', function(done) {
                chargify.get('customers.json?page=2', function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 200);
                    done();
                });
            });
            it('should return HTTP 200 for an existing user', function(done) {
                chargify.get('customers/' + id + '.json', function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 200);
                    assert.ok(body.customer);
                    assert.ok(body.customer.id);
                    assert.strictEqual(body.customer.first_name, 'Joe');
                    assert.strictEqual(body.customer.last_name, 'Smith');
                    done();
                });
            });
            it('should return HTTP 404 for an unknown user', function(done) {
                chargify.get('customers/99999999.json', function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 404);
                    done();
                });
            });
        });
        describe('del()', function() {
            it('should return HTTP 201 for a valid customer', function(done) {
                chargify.del({
                    uri: 'customers/' + id + '.json',
                }, function(err, res, body) {
                    if (err) throw err;
                    assert.strictEqual(res.statusCode, 403);
                    assert.strictEqual(body, '403 Forbidden');
                    done();
                });
            });
        });
    });
});
