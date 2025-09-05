import { Routes } from '@angular/router';
import { ListTaskComponent } from './list-task/list-task.component';
import { AssignTaskComponent } from './assign-task/assign-task.component';
import { KanbanBoardViewComponent } from './kanban-board-view/kanban-board-view.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

export default [
    {
        path     : 'list',
        component: ListTaskComponent,
    },
    {
        path     : 'assign',
        component: AssignTaskComponent,
    },
    {
        path     : 'edit/:guid',
        component: AssignTaskComponent
    },
    {
        path     : 'kanban',
        component: KanbanBoardViewComponent,
    },
    {
        path     : 'calendar',
        component: CalendarViewComponent,
    }
] as Routes;
