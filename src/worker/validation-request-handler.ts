import { validate } from "../../dist/jsonschema_wasm.js";
import { type ErrorResponse, MessageCodeSet, MessageTypeSet, type ValidationRequest, type ValidationResponse } from "./types.js";

export async function handleValidationRequest(message: ValidationRequest
): Promise<ValidationResponse | ErrorResponse> {
    const { id, schemaURL, data } = message;

    let schema: object;
    let validationResponse: ValidationResponse | ErrorResponse;

    try {
        const schemaResponse = await fetch(schemaURL);
        if (!schemaResponse.ok || schemaResponse.headers.get("content-type")?.indexOf("application/schema+json") === -1) {
            validationResponse = { type: MessageTypeSet.error, id, code: MessageCodeSet.SCHEMA_NOT_FOUND, message: (`Failed to fetch schema: ${schemaResponse.statusText}`) };
            return validationResponse;
        }
        schema = await schemaResponse.json();
    } catch (error) {
        validationResponse = { type: MessageTypeSet.error, id, code: MessageCodeSet.SCHEMA_PROCESSING_FAILED, message: error instanceof Error ? error.message : JSON.stringify(error) };
        return validationResponse;
    }

    try {
        const isValid = validate(JSON.stringify(schema), JSON.stringify(data));
        validationResponse = { type: MessageTypeSet.validation_result, id, isValid };
    } catch (error) {
        validationResponse = { type: MessageTypeSet.error, id, code: MessageCodeSet.VALIDATION_FAILED, message: error instanceof Error ? error.message : JSON.stringify(error) };
    }
    return validationResponse;
}
