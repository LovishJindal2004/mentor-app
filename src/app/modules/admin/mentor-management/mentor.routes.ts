import { Routes } from '@angular/router';
import { MentorManagementComponent } from './mentor-management.component';
import { AssignedStudentComponent } from './assigned-student/assigned-student.component';

export default [
    {
        path     : '',
        component: MentorManagementComponent,
    },
    {
        path     : 'assigned-students/:userId',
        component: AssignedStudentComponent,
    }
] as Routes;
