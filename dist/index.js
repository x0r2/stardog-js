'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stardog = function () {
    function Stardog(options) {
        (0, _classCallCheck3.default)(this, Stardog);

        this._endpoint = options.endpoint;

        this._options = {
            headers: {
                connection: 'close'
            },
            qsStringifyOptions: {
                arrayFormat: 'repeat'
            },
            resolveWithFullResponse: true
        };

        if (options.auth) {
            this._options.auth = options.auth;
        }
        if (options.database) {
            this._database = options.database;
        }
    }

    (0, _createClass3.default)(Stardog, [{
        key: 'createDatabase',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
                var resp;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._post('/admin/databases', {
                                    auth: options.auth,
                                    formData: {
                                        root: (0, _stringify2.default)({
                                            dbname: options.database,
                                            options: options.options || {},
                                            files: options.files || []
                                        })
                                    }
                                });

                            case 2:
                                resp = _context.sent;

                                if (!(!resp.message || !/success/i.test(resp.message))) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return', _promise2.default.reject(new Error('Unable to create database')));

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function createDatabase(_x) {
                return _ref.apply(this, arguments);
            }

            return createDatabase;
        }()
    }, {
        key: 'dropDatabase',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
                var resp;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._delete('/admin/databases/' + options.database, {
                                    auth: options.auth
                                });

                            case 2:
                                resp = _context2.sent;

                                if (!(!resp.message || !/success/i.test(resp.message))) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt('return', _promise2.default.reject(new Error('Unable to drop database')));

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function dropDatabase(_x2) {
                return _ref2.apply(this, arguments);
            }

            return dropDatabase;
        }()
    }, {
        key: 'sizeDatabase',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(options) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.t0 = parseInt;
                                _context3.next = 3;
                                return this._get('/' + options.database + '/size', {
                                    auth: options.auth
                                });

                            case 3:
                                _context3.t1 = _context3.sent;
                                return _context3.abrupt('return', (0, _context3.t0)(_context3.t1));

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function sizeDatabase(_x3) {
                return _ref3.apply(this, arguments);
            }

            return sizeDatabase;
        }()
    }, {
        key: 'listDatabases',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._get('/admin/databases', {
                                    auth: options.auth
                                });

                            case 2:
                                return _context4.abrupt('return', _context4.sent.databases);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function listDatabases() {
                return _ref4.apply(this, arguments);
            }

            return listDatabases;
        }()
    }, {
        key: 'existsDatabase',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(options) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.listDatabases(options);

                            case 2:
                                _context5.t0 = options.database;
                                return _context5.abrupt('return', _context5.sent.includes(_context5.t0));

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function existsDatabase(_x5) {
                return _ref5.apply(this, arguments);
            }

            return existsDatabase;
        }()
    }, {
        key: 'query',
        value: function query(options) {
            return this._queryUpdate('query', (0, _extends3.default)({
                accept: 'application/sparql-results+json, text/turtle'
            }, options));
        }
    }, {
        key: 'update',
        value: function update(options) {
            return this._queryUpdate('update', options);
        }
    }, {
        key: '_queryUpdate',
        value: function _queryUpdate(type, options) {
            var database = this._database || options.database;
            var url = options.tid ? '/' + database + '/' + options.tid + '/' : '/' + database + '/';

            return this._post(url + type, {
                auth: options.auth,
                accept: options.accept,
                form: {
                    query: options.query,
                    limit: options.limit,
                    offset: options.offset,
                    timeout: options.timeout,
                    reasoning: options.reasoning,
                    graph: options.graph,
                    insertGraph: options.insertGraph,
                    removeGraph: options.removeGraph
                }
            });
        }
    }, {
        key: '_request',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(url, options) {
                var data, resp, contentType;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                data = (0, _clone2.default)((0, _extends3.default)({}, options, this._options));


                                url = this._endpoint + url;

                                if (data.accept) {
                                    data.headers.accept = data.accept;
                                    delete data.accept;
                                }
                                if (data.contentType) {
                                    data.headers['content-type'] = data.contentType;
                                    delete data.contentType;
                                }

                                data.headers.accept = data.headers.accept || '*/*';

                                _context6.next = 7;
                                return (0, _requestPromiseNative2.default)(url, data);

                            case 7:
                                resp = _context6.sent;
                                contentType = resp.headers['content-type'];

                                if (contentType) {
                                    _context6.next = 11;
                                    break;
                                }

                                return _context6.abrupt('return');

                            case 11:
                                if (!(contentType.includes('application/sparql-results+json') || contentType.includes('application/json'))) {
                                    _context6.next = 21;
                                    break;
                                }

                                _context6.prev = 12;
                                return _context6.abrupt('return', JSON.parse(resp.body));

                            case 16:
                                _context6.prev = 16;
                                _context6.t0 = _context6['catch'](12);
                                return _context6.abrupt('return', _promise2.default.reject(new Error(_context6.t0)));

                            case 19:
                                _context6.next = 23;
                                break;

                            case 21:
                                if (!contentType.includes('text/boolean')) {
                                    _context6.next = 23;
                                    break;
                                }

                                return _context6.abrupt('return', resp.body === 'true');

                            case 23:
                                return _context6.abrupt('return', resp.body);

                            case 24:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[12, 16]]);
            }));

            function _request(_x6, _x7) {
                return _ref6.apply(this, arguments);
            }

            return _request;
        }()
    }, {
        key: '_get',
        value: function _get(url, options) {
            return this._request(url, (0, _extends3.default)({}, options, {
                method: 'GET'
            }));
        }
    }, {
        key: '_post',
        value: function _post(url, options) {
            return this._request(url, (0, _extends3.default)({}, options, {
                method: 'POST'
            }));
        }
    }, {
        key: '_delete',
        value: function _delete(url, options) {
            return this._request(url, (0, _extends3.default)({}, options, {
                method: 'DELETE'
            }));
        }
    }]);
    return Stardog;
}();

exports.default = Stardog;