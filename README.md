# stardog-js
JavaScript library for communication with the Stardog HTTP server.

## Install

    $ npm i stardog-js

## Import

### Using CommonJS

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
    auth: {
        user: 'user',
        pass: 'pass'
    },
    database: 'database'
});
```

### Invoke methods

```js
// Credentials and database are optional, this have lower priority than constructor settings

const data = await stardog.query({
    auth: {
        user: 'user',
        pass: 'pass'
    },
    database: 'database',
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
    auth: {
        user: 'admin',
        pass: 'admin'
    },
    database: 'database'
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
        auth: {
            user: 'admin',
            pass: 'admin'
        },
        database: 'database',
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
await stardog.createDatabase({
    database: 'database'
});
```

#### dropDatabase

Drop database.

```js
await stardog.dropDatabase({
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
const list = await stardog.listDatabases();
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

const data = await stardog.query({
    accept: 'text/boolean',
    query: 'ask {<urn:a> <urn:b> <urn:c>}'
});

const data = await stardog.query({
    query: 'construct {?s ?p ?o} where {?s ?p ?o}'
});

const data = await stardog.query({
    query: 'select * where {?s ?p ?o}',
    offset: 0,
    limit: 1,
    timeout: 1000,
    reasoning: true,
    graph: 'tag:stardog:api:context:default'
});
```

#### update

Execute update query.

```js
```
