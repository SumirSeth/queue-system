// Purpose: Quick status of the queue system.
// 1. The number of tasks in the queue.
// 2. The status of the Redis-like connection.

//Now, how do you use this?
// Easy. Call the api and look for response.error. If it's null, then the queue is healthy.

import { queueSize } from '../redis/utils';

export default defineEventHandler(() => {
    try{
        const taskCount = queueSize();
        
        return {
            status: 200,
            message: 'Queue system is healthy',
            data: {
                taskCount: taskCount,
                message: taskCount === 0 ? 'Queue is empty' : 'Queue is not empty',
                redisConnectionStatus: true
            }
        }
    } catch (error) {
        return {
            status: 500,
            message: 'Queue system is not healthy',
            data: {
                message: 'Health check failed. Check response.error for more details',
                redisConnectionStatus: false,
            },
            error: error
        }
    }
        
})