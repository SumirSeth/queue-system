import { get, set, del, keys } from './index';


const queueSize = () => {
    const allKeys = keys();
    return allKeys.length;
}

const getOldestTask = () => {
    const allKeys = keys();
    const oldestKey = allKeys[0];
    const taskData = get(oldestKey);
    return {
        taskId: oldestKey,
        taskData: taskData,
    };
}

const clearQueue = () => {
    const allKeys = keys();
    allKeys.forEach((key) => del(key));
}

export {
    queueSize,
    getOldestTask,
    clearQueue
}