import { Routes } from '@angular/router';
import { ListTaskComponent } from './list-task/list-task.component';
import { AssignTaskComponent } from './assign-task/assign-task.component';

export default [
    {
        path     : 'list',
        component: ListTaskComponent,
    },
    {
        path     : 'assign',
        component: AssignTaskComponent,
    }
] as Routes;
