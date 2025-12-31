import init, { validate } from "../../dist/jsonschema_wasm.js";
import { type ErrorResponse, type IncomingMessage, isValidationRequest, MessageCodeSet, MessageTypeSet } from "./types.js";
import { handleValidationRequest } from "./validation-request-handler.js";

let wasmStatus = "initializing";
init().then(() => {
    wasmStatus = "ready";
    self.postMessage({ type: MessageTypeSet.initialized });
}).catch((err) => {
    wasmStatus = "failed";
    self.postMessage({ type: MessageTypeSet.error, code: MessageCodeSet.VALIDATOR_INIT_FAILED, message: err.message});
});

self.addEventListener("message", async (event: MessageEvent<IncomingMessage>) => {
    if (wasmStatus !== "ready") {
        const errorResponse: ErrorResponse = { type: MessageTypeSet.error, code: MessageCodeSet.VALIDATOR_UNITIALIZED, message: "Validator is not initialized yet. Wait for an initialized or a failed message." };
        self.postMessage(errorResponse);
        return;
    }

    if (isValidationRequest(event.data)) {
        const validationResponse = await handleValidationRequest(event.data);
        self.postMessage(validationResponse);
        return;
    }

    self.postMessage({ type: MessageTypeSet.error, code: MessageCodeSet.INVALID_MESSAGE, message: `Received invalid message format.\n${JSON.stringify(event.data)}` });
});
