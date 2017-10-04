# stardog-js
JavaScript (Node.js) library for communication with the Stardog HTTP server.

## Install

```sh
$ yarn add stardog-js
```

## Import

### Using CommonJS

Requirements (Node.js >= 8.0.0).
```js
const Stardog = require('stardog-js');
```

### Using ESM

Use --experimental-modules flag and .mjs extension (Node.js >= 8.6.0).
```js
import Stardog from 'stardog-js';
```

## Usage

### Create instances

```js
// Create instance with only endpoint (required option)

const stardog = new Stardog({
    endpoint: 'http://localhost:5820'
});

// Create instance with credentials and database name (optional)

const stardog = new Stardog({
    endpoint: 'http://localhost:5820',
    database: 'database',
    auth: {
        user: 'user',
        pass: 'pass'
    }
});
```

### Invoke methods

```js
// Credentials and database are optional,
// this have lower priority than constructor settings

const data = await stardog.query({
    database: 'database',
    auth: {
        user: 'user',
        pass: 'pass'
    },
    query: 'select * where {?s ?p ?o}'
}).catch((err) => {
    return Promise.reject(err);
});
```

### Examples

```js
import Stardog from 'stardog-js';

const stardogAdminDatabase = new Stardog({
    endpoint: 'http://localhost:5820',
    database: 'database',
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

const stardogAdmin = new Stardog({
    endpoint: 'http://localhost:5820',
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

const stardog = new Stardog({
    endpoint: 'http://localhost:5820'
});

async function main() {
    const data1 = await stardogAdminDatabase.query({
        query: 'select * where {?s ?p ?o}'
    });

    const data2 = await stardogAdmin.query({
        database: 'database',
        query: 'select * where {?s ?p ?o}'
    });

    const data3 = await stardog.query({
        database: 'database',
        auth: {
            user: 'admin',
            pass: 'admin'
        },
        query: 'select * where {?s ?p ?o}'
    });
}

main();
```

## API

### Databases

#### createDatabase

Create new database.

```js
stardog.createDatabase({
    database: 'database'
});
```

#### dropDatabase

Drop database.

```js
stardog.dropDatabase({
    database: 'database'
});
```

#### sizeDatabase

Get size database.

```js
const size = await stardog.sizeDatabase({
    database: 'database'
});
```

#### listDatabases

Get list databases.

```js
const databases = await stardog.listDatabases();
```

#### existsDatabase

Check exists database.

```js
if (await stardog.existsDatabase({
        database: 'database'
    })) {
    console.log('exists');
}
```

### Queries

#### query

Execute query.

```js
const data = await stardog.query({
    query: 'select * where {?s ?p ?o}'
});

// Set accept to 'text/boolean', returns true or false

const data = await stardog.query({
    accept: 'text/boolean',
    query: 'ask {<urn:a> <urn:b> <urn:c>}'
});

const data = await stardog.query({
    query: 'construct {?s ?p ?o} where {?s ?p ?o}'
});

// Query to named graph 'tag:stardog:api:context:default'

const data = await stardog.query({
    query: 'select * where {?s ?p ?o}',
    graph: 'tag:stardog:api:context:default',
    offset: 0,
    limit: 1,
    timeout: 1000,
    reasoning: true
});

// Query to two named graphs

const data = await stardog.query({
    query: 'select * where {?s ?p ?o}',
    graph: ['urn:graph', 'urn:graph2']
});
```

#### update

Execute update query.

```js
stardog.update({
    query: 'insert data {<urn:a> <urn:b> <urn:c>}'
});

stardog.update({
    query: 'delete data {<urn:a> <urn:b> <urn:c>}'
});

// Insert to named graph 'urn:graph'

stardog.update({
    query: 'insert data {<urn:a> <urn:b> <urn:c>}',
    insertGraph: 'urn:graph'
});

// Remove from named graph 'urn:graph'

stardog.update({
    query: 'delete data {<urn:a> <urn:b> <urn:c>}',
    removeGraph: 'urn:graph'
});
```
