import TaskRepo from '@/api/task';
import PipeRepo from '@/api/pipe';
import TaskService from '@/services/task';
import PipeService from '@/services/pipe';
import SiteRepo from '@/api/site';
import SiteService from './sites';
import OperationRepo from '@/api/operation';
import OperationService from './operation';
import SearchFiltersService from './filters';


export const taskService = new TaskService(new TaskRepo());
export const pipeService = new PipeService(new PipeRepo());
export const siteService = new SiteService(new SiteRepo());
export const operationService = new OperationService(new OperationRepo());
export const searchFiltersService = new SearchFiltersService()
