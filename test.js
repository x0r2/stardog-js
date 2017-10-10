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
        query: 'insert data {<urn:s> <urn:p> <urn:o>}'
    });
});

afterAll(async () => {
    await stardog.dropDatabase({
        database: testDb
    });
});

describe('databases', () => {
    test('create', async () => {
        await stardog.createDatabase({
            database: 'create'
        });

        expect(await stardog.existsDatabase({
            database: 'create'
        })).toBeTruthy();

        stardog.dropDatabase({
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

describe('graphs', () => {
    test('drop', async () => {
        await stardog.update({
            query: 'insert data {<urn:drop> <urn:drop> <urn:drop>}',
            insertGraph: 'urn:drop'
        });

        expect(await stardog.existsGraph({
            graph: 'urn:drop'
        })).toBeTruthy();

        await stardog.dropGraph({
            graph: 'urn:drop'
        });

        expect(await stardog.existsGraph({
            graph: 'urn:drop'
        })).toBeFalsy();
    });

    test('copy', async () => {
        await stardog.update({
            query: 'insert data {<urn:copy> <urn:copy> <urn:copy>}',
            insertGraph: 'urn:from'
        });

        expect(await stardog.existsGraph({
            graph: 'urn:to'
        })).toBeFalsy();

        await stardog.copyGraph({
            from: 'urn:from',
            to: 'urn:to'
        });

        expect(await stardog.existsGraph({
            graph: 'urn:to'
        })).toBeTruthy();

        await Promise.all([
            stardog.dropGraph({
                graph: 'urn:from'
            }),
            stardog.dropGraph({
                graph: 'urn:to'
            })
        ]);
    });

    test('list', async () => {
        expect(await stardog.listGraphs()).toEqual([]);

        await stardog.update({
            query: 'insert data {<urn:list> <urn:list> <urn:list>}',
            insertGraph: 'urn:graph'
        });

        await stardog.update({
            query: 'insert data {<urn:list> <urn:list> <urn:list>}',
            insertGraph: 'urn:graph2'
        });

        expect(await stardog.listGraphs()).toEqual(['urn:graph', 'urn:graph2']);

        await Promise.all([
            stardog.dropGraph({
                graph: 'urn:graph'
            }),
            stardog.dropGraph({
                graph: 'urn:graph2'
            })
        ]);
    });

    test('exists', async () => {
        expect(await stardog.existsGraph({
            graph: 'urn:exists'
        })).toBeFalsy();

        await stardog.update({
            query: 'insert data {<urn:exists> <urn:exists> <urn:exists>}',
            insertGraph: 'urn:exists'
        });

        expect(await stardog.existsGraph({
            graph: 'urn:exists'
        })).toBeTruthy();

        await stardog.dropGraph({
            graph: 'urn:exists'
        });
    });
});

describe('queries', () => {
    test('ask', async () => {
        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:s> <urn:p> <urn:o>}'
        })).toBeTruthy();

        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:s> <urn:p> <urn:p>}'
        })).toBeFalsy();
    });

    test('select', async () => {
        expect(await stardog.query({
            query: 'select * where {?s ?p ?o}'
        })).toEqual({
            head: {vars: ['s', 'p', 'o']},
            results: {
                bindings: [{
                    s: {type: 'uri', value: 'urn:s'},
                    p: {type: 'uri', value: 'urn:p'},
                    o: {type: 'uri', value: 'urn:o'}
                }]
            }
        });
    });

    test('construct', async () => {
        expect(await stardog.query({
            query: 'construct {?s ?p ?o} where {?s ?p ?o}'
        })).toBe('\r\n<urn:s> <urn:p> <urn:o> .\r\n');
    });
});

describe('update queries', () => {
    test('insert', async () => {
        await stardog.update({
            query: 'insert data {<urn:insert> <urn:insert> <urn:insert>}'
        });

        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:insert> <urn:insert> <urn:insert>}'
        })).toBeTruthy();

        await stardog.update({
            query: 'delete data {<urn:insert> <urn:insert> <urn:insert>}'
        });
    });

    test('remove', async () => {
        await stardog.update({
            query: 'insert data {<urn:remove> <urn:remove> <urn:remove>}'
        });

        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:remove> <urn:remove> <urn:remove>}'
        })).toBeTruthy();

        await stardog.update({
            query: 'delete data {<urn:remove> <urn:remove> <urn:remove>}'
        });

        expect(await stardog.query({
            accept: 'text/boolean',
            query: 'ask {<urn:remove> <urn:remove> <urn:remove>}'
        })).toBeFalsy();
    });
});
