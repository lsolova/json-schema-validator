type UUID = string;
export const MessageTypeSet = {
    ["validation_request"]: "validation_request",
    ["initialized"]: "initialized",
    ["error"]: "error",
    ["validation_result"]: "validation_result"} as const;
export type MessageType = keyof typeof MessageTypeSet;

export const MessageCodeSet = {
    ["SCHEMA_NOT_FOUND"]: "SCHEMA_NOT_FOUND",
    ["SCHEMA_PROCESSING_FAILED"]: "SCHEMA_PROCESSING_FAILED",
    ["VALIDATION_FAILED"]: "VALIDATION_FAILED",
    ["VALIDATOR_INIT_FAILED"]: "VALIDATOR_INIT_FAILED",
    ["VALIDATOR_UNITIALIZED"]: "VALIDATOR_UNITIALIZED",
    ["INVALID_MESSAGE"]: "INVALID_MESSAGE"
} as const;
export type MessageCode = keyof typeof MessageCodeSet;

export type ErrorResponse = {
    type: typeof MessageTypeSet["error"];
    id?: UUID;
    code: MessageCode;
    message: string;
};
export type ValidationRequest = {
    type: typeof MessageTypeSet["validation_request"];
    id: UUID;
    schemaURL: string;
    data: object;
};
export type ValidationResponse = { type: typeof MessageTypeSet["validation_result"], id: UUID, isValid: boolean; };
export const isValidationRequest = (msg: any): msg is ValidationRequest => {
    return msg && msg.type === MessageTypeSet.validation_request && typeof msg.schemaURL === "string" && typeof msg.data === "object";
};
export type IncomingMessage = ValidationRequest;
export type OutgoingMessage = ValidationResponse | ErrorResponse | { type: typeof MessageTypeSet["initialized"] };
