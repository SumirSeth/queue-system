import { clearQueue } from '../../redis/utils';

export default defineEventHandler(() => {
    try {
        clearQueue();
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: 'Error clearing queue',
            error: error
        };
    }
    return {
        status: 200,
        message: 'Queue cleared successfully'
    };
});