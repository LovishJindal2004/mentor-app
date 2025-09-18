import { Routes } from '@angular/router';
import { ListTaskComponent } from './list-task/list-task.component';
import { AssignTaskComponent } from './assign-task/assign-task.component';
import { KanbanBoardViewComponent } from './kanban-board-view/kanban-board-view.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { MentorKanbanViewComponent } from './mentor-kanban-view/mentor-kanban-view.component';
import { MentorCalendarViewComponent } from './mentor-calendar-view/mentor-calendar-view.component';
import { TaskAssignedStudentsComponent } from './task-assigned-students/task-assigned-students.component';
import { TaskStudentReportComponent } from './task-student-report/task-student-report.component';

export default [
    {
        path     : 'list',
        component: ListTaskComponent,
    },
    {
        path     : 'assigned-students/:taskId',
        component: TaskAssignedStudentsComponent,
    },
    {
        path     : 'report/:taskId/:menteeId',
        component: TaskStudentReportComponent,
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
    },
    {
        path     : 'mentor-kanban',
        component: MentorKanbanViewComponent,
    },
    {
        path     : 'mentor-calendar',
        component: MentorCalendarViewComponent,
    }
] as Routes;
