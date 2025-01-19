import { get, set, del, keys } from '../../redis';

export default defineEventHandler(async (event) => {
    const allKeys = keys();

    if (allKeys.length === 0) {
        return {
            status: 404,
            message: 'No tasks to process'
        };
    }

    const oldestKey = allKeys[0];
    const taskData = get(oldestKey);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('Processing task:', taskData);


    //sara kaam hone ke baaad delete kardo
    del(oldestKey);

    return {
        status: 200,
        message: 'Task processed successfully',
        proccessedTask: {
            taskId: oldestKey,
            taskData: taskData,
        }
    };
})