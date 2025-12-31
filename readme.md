# JSON schema validator

This experimental project is to provide a secure JSON schema validation in browser environment. It uses _jsonschema_
Rust package wrapped into a WASM module and exposing functionality using a Worker and a simple SchemaValidator object.

## Usage

```ts
import { SchemaValidator } from "@lsolova/json-schema-validator";
import workerURL from "@lsolova/json-schema-validator/dist/worker.js?url";
import wasmURL from "@lsolova/json-schema-validator/dist/schema_validator_bg.wasm?url";

async function initValidation {
    await SchemaValidator.init(workerURL, wasmURL);
};

async function validate(schemaURL, data) {
    await SchemaValidator.validate(schemaURL, data);
};
```

## Development

1. Change to _wasm_ directory `cd wasm`
2. Run `cargo install`
3. Run `./build.sh`
4. Change back to root directory `cd ..`
5. Run `npm i`
6. Run `npm run build:worker`

### Local testing

To start the application on localhost, run `npm run serve`.
