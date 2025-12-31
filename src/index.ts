import { MessageTypeSet, type OutgoingMessage, type ValidationRequest } from "./worker";

const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

export function validateSchema(schemaURL: string, data: object): Promise<boolean> {
    console.log("Sending validation request to worker", schemaURL, data);
    return new Promise((resolve, reject) => {
        worker.onmessage = (event: MessageEvent<OutgoingMessage>) => {
            if (event.data.type === MessageTypeSet.error) {
                reject(new Error(event.data.message));
            } else if (event.data.type === MessageTypeSet.validation_result) {
                resolve(event.data.isValid);
            }
        };

        const validationRequest: ValidationRequest = { type: MessageTypeSet.validation_request, id: crypto.randomUUID(), schemaURL, data }
        worker.postMessage(validationRequest);
    });
}
