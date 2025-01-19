const store = new Map<string, any>();



export const set = (key: string, value: any): void => {
    store.set(key, value);
};

export const get = (key: string): any => {
    return store.get(key);
};

export const del = (key: string): void => {
    store.delete(key);
};

export const keys = (): string[] => {
    return Array.from(store.keys());
};