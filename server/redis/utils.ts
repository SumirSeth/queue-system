import { get, del, keys } from './index';


const queueSize = (): number => {
    return keys().length;
}

const getOldestTask = () => {
    const allKeys = keys();
    if (allKeys.length === 0) {
        return null;
    }
    const oldestKey = allKeys[0];
    const taskData = get(oldestKey);
    return {
        taskId: oldestKey,
        taskData: taskData,
    };
}

const clearQueue = () => {
    keys().forEach((key) => del(key));
}

export {
    queueSize,
    getOldestTask,
    clearQueue
}