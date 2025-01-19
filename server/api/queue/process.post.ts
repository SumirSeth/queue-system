import {  del } from '../../redis';
import { getOldestTask, queueSize } from '../../redis/utils';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const batchSize:number = body.batchSize || 1;

    const tasksToProcess = Math.min(batchSize, queueSize());

    if (tasksToProcess === 0) {
        return {
            status: 404,
            message: 'No tasks to process'
        };
    }

    const processedTasks = [];

    for (let i = 0; i < tasksToProcess; i++) {
        const oldestTask = getOldestTask();
        if (!oldestTask) {
            return {
                status: 404,
                message: 'No tasks to process'
            };
        }
        const {taskData, taskId} = oldestTask;

        try {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            console.log(`Processing task ${i + 1}/${tasksToProcess}:`, taskData);

            //sara kaam hone ke baaad delete kardo
            del(taskId);
            processedTasks.push({taskId: taskId, taskData: taskData});
        } catch (error) {
            console.error('Task processing failed:', error);
            return {
                status: 500,
                message: 'Task processing failed',
                error: error
            }
        }

    }

    return {
        status: 200,
        message: 'Task processed successfully',
        processedTasks: processedTasks
    };
})