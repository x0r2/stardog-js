import clone from 'clone';
import request from 'request-promise-native';

export default class Stardog {
    constructor(options) {
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

    async createDatabase(options) {
        const resp = await this._post('/admin/databases', {
            auth: options.auth,
            formData: {
                root: JSON.stringify({
                    dbname: options.database,
                    options: options.options || {},
                    files: options.files || []
                })
            }
        });

        if (!resp.message || !/success/i.test(resp.message)) {
            return Promise.reject(new Error('Unable to create database'));
        }
    }

    async dropDatabase(options) {
        const resp = await this._delete(`/admin/databases/${options.database}`, {
            auth: options.auth
        });

        if (!resp.message || !/success/i.test(resp.message)) {
            return Promise.reject(new Error('Unable to drop database'));
        }
    }

    async sizeDatabase(options) {
        return parseInt(await this._get(`/${options.database}/size`, {
            auth: options.auth
        }));
    }

    async listDatabases(options = {}) {
        return (await this._get('/admin/databases', {
            auth: options.auth
        })).databases;
    }

    async existsDatabase(options) {
        return (await this.listDatabases(options)).includes(options.database);
    }

    query(options) {
        return this._queryUpdate('query', {
            accept: 'application/sparql-results+json, text/turtle',
            ...options
        });
    }

    update(options) {
        return this._queryUpdate('update', options);
    }

    _queryUpdate(type, options) {
        const database = this._database || options.database;
        const url = options.tid ? `/${database}/${options.tid}/` : `/${database}/`;

        return this._post(url + type, {
            auth: options.auth,
            accept: options.accept,
            form: {
                query: options.query,
                limit: options.limit,
                offset: options.offset,
                timeout: options.timeout,
                reasoning: options.reasoning,
                'using-graph-uri': options.graph,
                'insert-graph-uri': options.insertGraph,
                'remove-graph-uri': options.removeGraph
            }
        });
    }

    async _request(url, options) {
        const data = clone({
            ...options,
            ...this._options
        });

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

        const resp = await request(url, data);
        const contentType = resp.headers['content-type'];

        if (!contentType) {
            return;
        }

        if (contentType.includes('application/sparql-results+json') ||
            contentType.includes('application/json')) {
            try {
                return JSON.parse(resp.body);
            } catch (err) {
                return Promise.reject(new Error(err));
            }
        }
        else if (contentType.includes('text/boolean')) {
            return (resp.body === 'true');
        }

        return resp.body;
    }

    _get(url, options) {
        return this._request(url, {
            ...options,
            method: 'GET'
        });
    }

    _post(url, options) {
        return this._request(url, {
            ...options,
            method: 'POST'
        });
    }

    _delete(url, options) {
        return this._request(url, {
            ...options,
            method: 'DELETE'
        });
    }
}
