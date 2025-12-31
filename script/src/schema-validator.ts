import { MessageHandler } from "./message-handler";
import { type ErrorResponse, type InitializedResponse, type InitializeRequest, MessageCodeSet, MessageTypeSet, type ValidationRequest, type ValidationResponse } from "./worker/types";

export class SchemaValidator {
    private _messageHandler: MessageHandler | null = null;
    private _worker: Worker | null = null;

    async init(workerURL: string, wasmURL: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this._worker) {
                this._worker = new Worker(new URL(workerURL, import.meta.url), { type: 'module' });
                this._messageHandler = new MessageHandler(this._worker);

                this._messageHandler.subscribe<InitializedResponse>(MessageTypeSet.INITIALIZED, () => {
                    resolve();
                    return true;
                });
                this._messageHandler.subscribe<ErrorResponse>(MessageTypeSet.ERROR, (data) => {
                    if (data.code === MessageCodeSet.VALIDATOR_INIT_FAILED) {
                        reject(new Error("Worker initialization failed."));
                        return true;
                    }
                    return false;
                });

                const initializationRequest: InitializeRequest = { type: MessageTypeSet.INITIALIZE, wasmURL };
                this._worker.postMessage(initializationRequest);
            } else {
                resolve();
            }
        });
    }

    async validate(schemaURL: string, data: object): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._worker || !this._messageHandler) {
                reject(new Error("Worker is not initialized. Call init() first."));
                return;
            }

            const id = crypto.randomUUID();

            this._messageHandler.subscribe<ErrorResponse>(MessageTypeSet.ERROR, (data) => {
                if (data.id !== id) return false;
                reject(new Error(data.message));
                return true;
            });
            this._messageHandler.subscribe<ValidationResponse>(MessageTypeSet.VALIDATION_RESULT, (data) => {
                if (data.id !== id) return false;
                resolve(data.isValid);
                return true;
            });

            const validationRequest: ValidationRequest = { type: MessageTypeSet.VALIDATION_REQUEST, id, schemaURL, data };
            this._worker.postMessage(validationRequest);
        });
    }
}
