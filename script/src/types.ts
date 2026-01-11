type ValueOf<T> = T[keyof T];

export const WasmStatusSet = {
    FAILED: "failed",
    READY: "ready",
    UNINITIALIZED: "uninitialized",
} as const;
export type WasmStatus = ValueOf<typeof WasmStatusSet>;
