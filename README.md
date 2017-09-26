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

```js
import Stardog from 'stardog-js';
```

## Usage

### Create instances

```js
// Create instance with only endpoint (required)

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
