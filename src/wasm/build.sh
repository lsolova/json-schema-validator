#!/bin/bash
#wasm-pack build --target web --out-dir ../../dist --out-name jsonschema_wasm --release
#Run in this directory
cargo install wasm-bindgen-cli
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen --out-dir ../../dist --target web ./target/wasm32-unknown-unknown/release/jsonschema_wasm.wasm
