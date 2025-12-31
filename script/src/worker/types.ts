type UUID = string;
export const MessageTypeSet = {
    ["VALIDATION_REQUEST"]: "VALIDATION_REQUEST",
    ["INITIALIZE"]: "INITIALIZE",
    ["INITIALIZED"]: "INITIALIZED",
    ["ERROR"]: "ERROR",
    ["VALIDATION_RESULT"]: "VALIDATION_RESULT"} as const;
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
    type: typeof MessageTypeSet["ERROR"];
    id?: UUID;
    code: MessageCode;
    message: string;
};
export type InitializeRequest = {
    type: typeof MessageTypeSet["INITIALIZE"];
    wasmURL: string;
}
export const isInitializeRequest = (msg: any): msg is InitializeRequest => {
    return msg && msg.type === MessageTypeSet.INITIALIZE && typeof msg.wasmURL === "string";
};
export type InitializedResponse = {
    type: typeof MessageTypeSet["INITIALIZED"];
};
export type ValidationRequest = {
    type: typeof MessageTypeSet["VALIDATION_REQUEST"];
    id: UUID;
    schemaURL: string;
    data: object;
};
export type ValidationResponse = { type: typeof MessageTypeSet["VALIDATION_RESULT"], id: UUID, isValid: boolean; };
export const isValidationRequest = (msg: any): msg is ValidationRequest => {
    return msg && msg.type === MessageTypeSet.VALIDATION_REQUEST && typeof msg.schemaURL === "string" && typeof msg.data === "object";
};
export type IncomingMessage = InitializeRequest | ValidationRequest;
export type OutgoingMessage = ErrorResponse | InitializedResponse | ValidationResponse;
