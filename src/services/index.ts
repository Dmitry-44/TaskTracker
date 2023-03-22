import TaskRepo from '@/api/task';
import PipeRepo from '@/api/pipe';
import TaskService from '@/services/task';
import PipeService from '@/services/pipe';

const taskRepo = new TaskRepo();
export const taskService = new TaskService(taskRepo);

const pipeRepo = new PipeRepo();
export const pipeService = new PipeService(pipeRepo);