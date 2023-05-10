import taskStoreUpdater from '@/services/taskStoreUpdater';
import TaskRepo from '@/api/task';
import PipeRepo from '@/api/pipe';
import TaskService from '@/services/task';
import PipeService from '@/services/pipe';
import SiteRepo from '@/api/site';
import SiteService from './sites';
import OperationRepo from '@/api/operation';
import OperationService from './operation';
import SearchFiltersService from '@/services/searchFilters';
import UserService from './user';
import UserRepo from '@/api/user';
import PiniaUserAdapter from '@/adapters/piniaUserAdapter';
import PiniaTaskAdapter from '@/adapters/piniaTaskAdapter';
import piniaCommonAdapter from '@/adapters/piniaCommonAdapter';
import PiniaSiteAdapter from '@/adapters/piniaSiteAdapter';
import PiniaOperationAdapter from '@/adapters/piniaOperationAdapter';
import PiniaPipeAdapter from '@/adapters/piniaPipeAdapter';



function initServices() {
    console.log('INIT SERVICES')
    const taskService = new TaskService(
        new TaskRepo(),
        new PiniaTaskAdapter(),
        new piniaCommonAdapter(),
        new PiniaUserAdapter()
    );
    const pipeService = new PipeService(
        new PipeRepo(),
        new PiniaPipeAdapter()
    );
    const siteService = new SiteService(
        new SiteRepo(),
        new PiniaSiteAdapter(),
    );
    const operationService = new OperationService(
        new OperationRepo(),
        new PiniaOperationAdapter(),
    );
    const searchFiltersService = new SearchFiltersService(new PiniaUserAdapter(), new PiniaTaskAdapter(), new piniaCommonAdapter());
    const userService = new UserService(
        new UserRepo(), 
        new PiniaUserAdapter(),
        new piniaCommonAdapter()
    )
    const storeUpdater = taskStoreUpdater(new PiniaTaskAdapter());

    return {
        Task: taskService,
        Pipe: pipeService,
        Site: siteService,
        Operation: operationService,
        Filters: searchFiltersService,
        User: userService,
        taskStoreUpdater: storeUpdater
    }
}

export default initServices