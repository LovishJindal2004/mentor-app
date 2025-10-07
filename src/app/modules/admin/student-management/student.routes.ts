import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { AssignedStudentComponent } from './assigned-student/assigned-student.component';
import { ViewProgressComponent } from './view-progress/view-progress.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { AssignedCourseComponent } from './assigned-course/assigned-course.component';

export default [
    {
        path     : '',
        component: StudentListComponent,
    },
    {
        path     : 'assigned-students',
        component: AssignedStudentComponent,
    },
    {
        path     : 'view-progress',
        component: ViewProgressComponent,
    },
    {
        path     : 'view-report',
        component: ViewReportsComponent,
    },
    {
        path     : 'assigned-course/:userId',
        component: AssignedCourseComponent,
    },
] as Routes;
