import { type MessageType, type OutgoingMessage } from "./worker";

export class MessageHandler {
    private subscribers: Map<MessageType, Array<((data: OutgoingMessage) => boolean)>> = new Map();

    constructor(workerInstance: Worker) {
        workerInstance.onmessage = this.onMessage.bind(this);
    };

    private onMessage(event: MessageEvent<OutgoingMessage>) {
        const messageType = event.data.type;
        const callbacks = this.subscribers.get(messageType);

        if (callbacks) {
            const callbacksToRemove = callbacks.map(callback => {
                return (callback(event.data)) ? callback : null;
            }).filter(Boolean);
            if (callbacksToRemove.length > 0) {
                this.subscribers.set(messageType, callbacks.filter(cb => !callbacksToRemove.includes(cb)));
            }
        }
    };

    subscribe<EventType extends OutgoingMessage>(type: EventType["type"], callback: (data: EventType) => boolean) {
        let subscriberSet = this.subscribers.get(type);
        if (!subscriberSet) {
            subscriberSet = [];
            this.subscribers.set(type, subscriberSet);
        }
        subscriberSet.push(callback as (data: OutgoingMessage) => boolean);
    };
}
