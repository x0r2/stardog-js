import Stardog from './index';

const testDb = 'test';

const stardogAdmin = new Stardog({
    endpoint: 'http://localhost:5820',
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

beforeAll(async () => {
    await stardogAdmin.createDatabase({
        database: testDb
    });

    await stardogAdmin.update({
        database: testDb,
        query: 'insert data {<urn:a> <urn:b> <urn:c>}'
    });
});

afterAll(async () => {
    await stardogAdmin.dropDatabase({
        database: testDb
    });
});

describe('database', () => {
    test('create', async () => {
        await stardogAdmin.createDatabase({
            database: 'create'
        });

        expect(await stardogAdmin.existsDatabase({
            database: 'create'
        })).toBeTruthy();

        await stardogAdmin.dropDatabase({
            database: 'create'
        });
    });

    test('drop', async () => {
        await stardogAdmin.createDatabase({
            database: 'drop'
        });

        expect(await stardogAdmin.existsDatabase({
            database: 'drop'
        })).toBeTruthy();

        await stardogAdmin.dropDatabase({
            database: 'drop'
        });

        expect(await stardogAdmin.existsDatabase({
            database: 'drop'
        })).toBeFalsy();
    });

    test('size', async () => {
        expect(await stardogAdmin.sizeDatabase({
            database: testDb
        })).toBe(1);
    });

    test('list', async () => {
        expect(await stardogAdmin.listDatabases()).toContain('test');
    });

    test('exists', async () => {
        expect(await stardogAdmin.existsDatabase({
            database: testDb
        })).toBeTruthy();

        expect(await stardogAdmin.existsDatabase({
            database: testDb + '2'
        })).toBeFalsy();
    });
});

describe('query', () => {
    test('ask', async () => {
        expect(await stardogAdmin.query({
            database: testDb,
            accept: 'text/boolean',
            query: 'ask {<urn:a> <urn:b> <urn:c>}'
        })).toBeTruthy();

        expect(await stardogAdmin.query({
            database: testDb,
            accept: 'text/boolean',
            query: 'ask {<urn:a> <urn:b> <urn:d>}'
        })).toBeFalsy();
    });

    test('select', async () => {
        expect(await stardogAdmin.query({
            database: testDb,
            query: 'select * where {?s ?p ?o}'
        })).toEqual({
            head: {vars: ['s', 'p', 'o']},
            results: {
                bindings: [{
                    s: {type: 'uri', value: 'urn:a'},
                    o: {type: 'uri', value: 'urn:c'},
                    p: {type: 'uri', value: 'urn:b'}
                }]
            }
        });
    });

    test('construct', async () => {
        expect(await stardogAdmin.query({
            database: testDb,
            query: 'construct {?s ?p ?o} where {?s ?p ?o}'
        })).toBe('\r\n<urn:a> <urn:b> <urn:c> .\r\n');
    });
});
