import { get, keys } from '../../redis';
import { getOldestTask, queueSize } from '../../redis/utils';


export default defineEventHandler(() => {
  const allKeys = keys();
  const allTasks = allKeys.map((key) => ({ key, data: get(key) }));
  const oldestTask = getOldestTask();

  return { success: true, tasks: allTasks, oldestTask: oldestTask, queueSize: queueSize() };
});