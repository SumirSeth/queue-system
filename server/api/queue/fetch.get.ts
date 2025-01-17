import { get, keys } from '../../redis';

export default defineEventHandler(() => {
  const allKeys = keys();
  const allTasks = allKeys.map((key) => ({ key, data: get(key) }));

  return { success: true, tasks: allTasks };
});