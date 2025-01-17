import { set } from '../../redis';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { taskId, taskData } = body;

    set(taskId, taskData);
    return {
        status: 200,
        message: 'Task added successfully'
    }; 
});