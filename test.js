import Stardog from './index';

jest.setTimeout(10000);

const testDb = 'test';

const stardog = new Stardog({
    endpoint: 'http://localhost:5820',
    database: testDb,
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

beforeAll(async () => {
    await stardog.createDatabase({
        database: testDb
    });

    await stardog.update({
        query: 'insert data {<urn:a> <urn:b> <urn:c>}'
    });
});

afterAll(async () => {
    await stardog.dropDatabase({
        database: testDb
    });
});

describe('database', () => {
    test('create', async () => {
        await stardog.createDatabase({
            database: 'create'
        });

        expect(await stardog.existsDatabase({
            database: 'create'
        })).toBeTruthy();

        await stardog.dropDatabase({
            database: 'create'
        });
    });

    test('drop', async () => {
        await stardog.createDatabase({
            database: 'drop'
        });

        expect(await stardog.existsDatabase({
            database: 'drop'
        })).toBeTruthy();

        await stardog.dropDatabase({
            database: 'drop'
        });

        expect(await stardog.existsDatabase({
            database: 'drop'
        })).toBeFalsy();
    });

    test('size', async () => {
        expect(await stardog.sizeDatabase({
            database: testDb
        })).toBe(1);
    });

    test('list', async () => {
        expect(await stardog.listDatabases()).toContain(testDb);
    });

    test('exists', async () => {
        expect(await stardog.existsDatabase({
            database: testDb
        })).toBeTruthy();

        expect(await stardog.existsDatabase({
            database: testDb + '2'
        })).toBeFalsy();
    });
});

describe('query', () => {
    test('ask', async () => {
        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:a> <urn:b> <urn:c>}'
        })).toBeTruthy();

        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:a> <urn:b> <urn:d>}'
        })).toBeFalsy();
    });

    test('select', async () => {
        expect(await stardog.query({
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
        expect(await stardog.query({
            query: 'construct {?s ?p ?o} where {?s ?p ?o}'
        })).toBe('\r\n<urn:a> <urn:b> <urn:c> .\r\n');
    });
});

describe('update', () => {
    test('insert', async () => {
        await stardog.update({
            query: 'insert data {<urn:a> <urn:b> <urn:c>}'
        });
    });
});
